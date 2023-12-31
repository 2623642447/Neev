package indi.zyang.neev.unit;

import indi.zyang.neev.entity.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Tool {

    public static Map<String, Object> formatData(Object info, GraphData graphData, String item){
        Map<String, Object> data = new HashMap<>();
        data.put("info", info);
        data.put("graphData", graphData);
        data.put("item", item);
        return data;
    }

//    public static Map<String, Object> formatSearchResult(List<Prescription> prescriptionList, List<Herb> herbList, List<Disease> diseaseList, List<Book> bookList, List<Geography> geographyList, List<HerbInfo> herbInfoList){
//        Map<String, Object> data = new HashMap<>();
//        data.put("prescription", prescriptionList);
//        data.put("herb", herbList);
//        data.put("herbInfo", herbInfoList);
//        data.put("disease", diseaseList);
//        data.put("book", bookList);
//        data.put("geography", geographyList);
//        return data;
//    }

    public static Map<String, Object> formatSearchReturn(Map<String, Object> searchResult, int count){
        Map<String, Object> data = new HashMap<>();
        data.put("data", searchResult);
        data.put("count", count);
        return data;
    }

    public static Edge buildEdge(String source, String target){
        Edge edge = new Edge(source, target);
        return edge;
    }

    public static Node buildNode(String nodeId, String nodeName, int category){
        Node node = new Node(nodeId, nodeName, 18, 142.43670600000002, 0.9626298999999999, 20.457146, category);
        return node;
    }

    /**
      * @Author Zyang
      * @Desctription TODO 制造节点且具有Node特性
      * @Date 2023/6/4 17:53
      * @Param [nodeId, nodeName, category]
      * @return indi.zyang.neev.unit.Node
      */
    public static Node buildNodeWithFeature(String nodeId, String nodeName, int category, int size){
        Node node = new Node(nodeId, nodeName, size, 142.43670600000002, 0.9626298999999999, 20.457146, category);
        return node;
    }

    public static Map<String, String> formatObjName(String type, String name){
        Map<String, String> data = new HashMap<>();
        data.put("type", type);
        data.put("name", name);
        return data;
    }

    public static Map<String, String> formatImageInfo(String url, String alt, String href){
        Map<String, String> data = new HashMap<>();
        data.put("url", url);
        data.put("alt", alt);
        data.put("href", href);
        return data;
    }

    public static String getIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    /**
      * @Author Zyang
      * @Desctription 将市值大小按照中位medianValue成比例缩放，默认值为100亿，默认Node大小为18
      * @Date 2023/6/5 17:37
      * @Param [marketValue, medianValue]
      * @return int
      */
    public static int convertMarketValueToNodeSize(int marketValue,int medianValue){
        if (medianValue == 0){
            return 18;
        }
        double doubleMarketValue = marketValue;
        double doubleMedianValue = medianValue;
        int defaultSize = 18;
        return (int)(defaultSize*(marketValue/medianValue));
    }
}