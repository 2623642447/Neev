package indi.zyang.neev.entity;

import org.apache.ibatis.type.Alias;

@Alias("description")
public class Description {
    private int desId;

    private int entityId;

    private String unit;

    private String desName;

    private String content;

    private int isContain;

    public int getDesId() {
        return desId;
    }

    public void setDesId(int desId) {
        this.desId = desId;
    }

    public int getEntityId() {
        return entityId;
    }

    public void setEntityId(int entityId) {
        this.entityId = entityId;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getDesName() {
        return desName;
    }

    public void setDesName(String desName) {
        this.desName = desName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getIsContain() {
        return isContain;
    }

    public void setIsContain(int isContain) {
        this.isContain = isContain;
    }
}
