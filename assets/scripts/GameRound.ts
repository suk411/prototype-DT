import { _decorator, Component, SpriteFrame, Label, Sprite } from 'cc';
import { CardView } from './CardView';

const { ccclass, property } = _decorator;

@ccclass('GameRound')
export class GameRound extends Component {

    // ================= CARDS =================

    @property(CardView)
    dragonCard: CardView = null;

    @property(CardView)
    tigerCard: CardView = null;

    // ================= TIMER UI =================

    @property(Label)
    timerLabel: Label = null;

    @property(Sprite)
    timerProgress: Sprite = null;

    // Timer values
    roundTime: number = 12;
    currentTime: number = 12;

    private runningTimer: boolean = false;
    private lastShownSecond: number = 12;

    // ================= RANK SPRITES =================

    @property([SpriteFrame])
    redRanks: SpriteFrame[] = [];

    @property([SpriteFrame])
    blackRanks: SpriteFrame[] = [];

    // ================= SUIT ICONS =================

    @property(SpriteFrame) heart: SpriteFrame = null;
    @property(SpriteFrame) diamond: SpriteFrame = null;
    @property(SpriteFrame) spade: SpriteFrame = null;
    @property(SpriteFrame) club: SpriteFrame = null;

    // ================= FACE ARTWORK (J/Q/K) =================

    @property(SpriteFrame) redJFace: SpriteFrame = null;
    @property(SpriteFrame) redQFace: SpriteFrame = null;
    @property(SpriteFrame) redKFace: SpriteFrame = null;

    @property(SpriteFrame) blackJFace: SpriteFrame = null;
    @property(SpriteFrame) blackQFace: SpriteFrame = null;
    @property(SpriteFrame) blackKFace: SpriteFrame = null;

    // ================= START =================

    start() {
        this.startTimer();
    }

    // ================= TIMER START =================

    startTimer() {

        this.currentTime = this.roundTime;

        // Start ring empty
        if (this.timerProgress) {
            this.timerProgress.fillRange = 0;
        }

        // Start timer loop
        this.runningTimer = true;

        // Show correct starting number
        this.lastShownSecond = Math.ceil(this.currentTime);

        if (this.timerLabel) {
            this.timerLabel.string = this.lastShownSecond.toString();
        }
    }

    // ================= SMOOTH TIMER UPDATE =================

    update(dt: number) {

        if (!this.runningTimer) return;

        // Smooth countdown
        this.currentTime -= dt;

        if (this.currentTime < 0) {
            this.currentTime = 0;
        }

        // Smooth progress (0 → 1)
        let progress = 1 - (this.currentTime / this.roundTime);

        // ✅ Clockwise ring fill
        if (this.timerProgress) {
            this.timerProgress.fillRange = -progress;
        }

        // Update number only when second changes
        let sec = Math.ceil(this.currentTime);

        if (sec !== this.lastShownSecond) {
            this.lastShownSecond = sec;

            if (this.timerLabel) {
                this.timerLabel.string = sec.toString();
            }
        }

        // Timer finished
        if (this.currentTime <= 0) {
            this.runningTimer = false;
            this.startRound();
        }
    }

    // ================= ROUND START =================

    startRound() {

        // Reset cards
        this.dragonCard.resetCard();
        this.tigerCard.resetCard();

        // Random cards
        const dragon = this.getRandomCard();
        const tiger = this.getRandomCard();

        // Apply card sprites
        this.dragonCard.setCard(
            dragon.rankSprite,
            dragon.suitSprite,
            dragon.brReplacement
        );

        this.tigerCard.setCard(
            tiger.rankSprite,
            tiger.suitSprite,
            tiger.brReplacement
        );

        // Flip animation
        this.dragonCard.flipOpen(() => {

            this.tigerCard.flipOpen(() => {

                // Winner check
                if (tiger.value > dragon.value) {
                    this.tigerCard.blinkGlow(2);
                }
                else if (dragon.value > tiger.value) {
                    this.dragonCard.blinkGlow(2);
                }
                else {
                    this.dragonCard.blinkGlow(1);
                    this.tigerCard.blinkGlow(1);
                }

                // Restart timer after 3 seconds
                this.scheduleOnce(() => {
                    this.startTimer();
                }, 3);

            });

        });
    }

    // ================= RANDOM CARD GENERATOR =================

    getRandomCard() {

        // Value: 2–14 (J=11, Q=12, K=13, A=14)
        let value = Math.floor(Math.random() * 13) + 2;

        // Suit: 0♥ 1♦ 2♠ 3♣
        let suitIndex = Math.floor(Math.random() * 4);

        let suitSprite: SpriteFrame = null;
        let rankSprite: SpriteFrame = null;
        let brReplacement: SpriteFrame = null;

        // Suit icons
        if (suitIndex === 0) suitSprite = this.heart;
        if (suitIndex === 1) suitSprite = this.diamond;
        if (suitIndex === 2) suitSprite = this.spade;
        if (suitIndex === 3) suitSprite = this.club;

        // Red or Black?
        let isRed = (suitIndex === 0 || suitIndex === 1);

        // Rank sprite selection
        rankSprite = isRed
            ? this.redRanks[value - 2]
            : this.blackRanks[value - 2];

        // Face card SuitBR replacement
        if (value === 11) brReplacement = isRed ? this.redJFace : this.blackJFace;
        if (value === 12) brReplacement = isRed ? this.redQFace : this.blackQFace;
        if (value === 13) brReplacement = isRed ? this.redKFace : this.blackKFace;

        return {
            value,
            suitSprite,
            rankSprite,
            brReplacement
        };
    }
}