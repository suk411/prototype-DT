import { _decorator, Component, Node, Vec3, Input } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ChipSelect')
export class ChipSelect extends Component {

    @property(Node)
    border: Node = null;

    start() {
        // Hide border initially
        if (this.border) this.border.active = false;

        // Make chip clickable (BEST way)
        this.node.on(Input.EventType.TOUCH_END, this.selectThisChip, this);
    }

    selectThisChip() {

        // Reset all chips
        const allChips = this.node.parent.children;

        allChips.forEach(chipNode => {
            const chipScript = chipNode.getComponent(ChipSelect);

            if (chipScript && chipScript.border) {
                chipScript.border.active = false;
                chipNode.setScale(new Vec3(1, 1, 1));
            }
        });

        // Activate this chip
        if (this.border) this.border.active = true;

        this.node.setScale(new Vec3(1.05, 1.05, 1));
    }
}