import { _decorator, Component, Node, Sprite, SpriteFrame, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CardView')
export class CardView extends Component {

    @property(Node) back: Node = null;
    @property(Node) glow: Node = null;

    @property(Sprite) rankTL: Sprite = null;
    @property(Sprite) suitTL: Sprite = null;
    @property(Sprite) suitBR: Sprite = null;

    start() {
        this.resetCard();
    }

    resetCard() {
        this.back.active = true;
        this.glow.active = false;
    }

    // ✅ Now SuitBR can show suit OR face image
    setCard(
        rank: SpriteFrame,
        suit: SpriteFrame,
        suitBRReplacement?: SpriteFrame
    ) {

        // Top left always normal
        this.rankTL.spriteFrame = rank;
        this.suitTL.spriteFrame = suit;

        // Bottom-right:
        // If face card → show face artwork
        // Else → show normal suit icon
        if (suitBRReplacement) {
            this.suitBR.spriteFrame = suitBRReplacement;
        } else {
            this.suitBR.spriteFrame = suit;
        }
    }

    flipOpen(callback?: Function) {
        tween(this.node)
            .to(0.2, { scale: new Vec3(0, 1, 1) })
            .call(() => {
                this.back.active = false;
                if (callback) callback();
            })
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    blinkGlow(times: number = 2) {
        let count = 0;
        this.glow.active = true;

        const blink = () => {
            if (count >= times * 2) {
                this.glow.active = true;
                return;
            }

            this.glow.active = !this.glow.active;
            count++;
            setTimeout(blink, 200);
        };

        blink();
    }
}