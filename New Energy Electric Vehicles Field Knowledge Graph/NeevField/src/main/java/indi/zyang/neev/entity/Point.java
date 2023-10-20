package indi.zyang.neev.entity;

public class Point {
    private String time;

    private String pointName;

    private double value;

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public String getPoint_name(){
        return pointName;
    }
}
