package codes.blitz.game.message.bot;

import java.util.List;

import codes.blitz.game.message.MessageType;
import codes.blitz.game.message.game.Action;

public class BotMessage
{
    private MessageType type;
    private List<Action> actions;
    private String colonyName;
    private String token;
    private Integer tick;

    public Integer getTick()
    {
        return this.tick;
    }

    public void setTick(Integer tick)
    {
        this.tick = tick;
    }

    public MessageType getType()
    {
        return type;
    }

    public void setType(MessageType type)
    {
        this.type = type;
    }

    public List<Action> getActions()
    {
        return actions;
    }

    public void setActions(List<Action> action)
    {
        this.actions = action;
    }

    public String getColonyName()
    {
        return colonyName;
    }

    public void setColonyName(String colonyName)
    {
        this.colonyName = colonyName;
    }

    public String getToken()
    {
        return token;
    }

    public void setToken(String token)
    {
        this.token = token;
    }

    @Override
    public int hashCode()
    {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((actions == null) ? 0 : actions.hashCode());
        result = prime * result + ((colonyName == null) ? 0 : colonyName.hashCode());
        result = prime * result + ((token == null) ? 0 : token.hashCode());
        result = prime * result + ((type == null) ? 0 : type.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj)
    {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        BotMessage other = (BotMessage) obj;
        if (actions != other.actions) {
            return false;
        }
        if (colonyName == null) {
            if (other.colonyName != null) {
                return false;
            }
        } else if (!colonyName.equals(other.colonyName)) {
            return false;
        }
        if (token == null) {
            if (other.token != null) {
                return false;
            }
        } else if (!token.equals(other.token)) {
            return false;
        }
        if (type != other.type) {
            return false;
        }
        return true;
    }

    @Override
    public String toString()
    {
        return "BotMessage [type=" + type + ", action=" + actions + ", name=" + colonyName + ", token=" + token + "]";
    }
}
