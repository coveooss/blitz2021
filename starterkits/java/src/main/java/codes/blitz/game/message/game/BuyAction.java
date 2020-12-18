package codes.blitz.game.message.game;

public class BuyAction extends Action {
    private UnitType unitType;

    protected BuyAction(UnitType unitType) {
        super(ActionType.BUY);
        this.unitType = unitType;
    }

    public UnitType getUnitType() {
        return unitType;
    }

    public void setUnitType(UnitType unitType) {
        this.unitType = unitType;
    }
}
