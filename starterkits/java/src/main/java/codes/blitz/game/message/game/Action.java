package codes.blitz.game.message.game;

public abstract class Action {
    private final ActionType actionType;

    protected Action(ActionType actionType) {
        this.actionType = actionType;
    }

    public ActionType getActionType() {
        return actionType;
    }
}
