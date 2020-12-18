package codes.blitz.game.message.game;

import java.util.List;

public class Colony {
    private String id;
    private String name;
    private Position homeBase;
    private Position spawnPoint;
    private int blitzium;
    private int totalBlitzium;
    private List<Unit> units;
    private List<String> errors;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Position getHomeBase() {
        return homeBase;
    }

    public void setHomeBase(Position homeBase) {
        this.homeBase = homeBase;
    }

    public Position getSpawnPoint() {
        return spawnPoint;
    }

    public void setSpawnPoint(Position spawnPoint) {
        this.spawnPoint = spawnPoint;
    }

    public int getBlitzium() {
        return blitzium;
    }

    public void setBlitzium(int blitzium) {
        this.blitzium = blitzium;
    }

    public int getTotalBlitzium() {
        return totalBlitzium;
    }

    public void setTotalBlitzium(int totalBlitzium) {
        this.totalBlitzium = totalBlitzium;
    }

    public List<Unit> getUnits() {
        return units;
    }

    public void setUnits(List<Unit> units) {
        this.units = units;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

}
