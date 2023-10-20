package indi.zyang.neev.service.impl;

import indi.zyang.neev.dao.CompanyMapper;
import indi.zyang.neev.dao.DescriptionMapper;
import indi.zyang.neev.dao.IndustryMapper;
import indi.zyang.neev.entity.Company;
import indi.zyang.neev.entity.Description;
import indi.zyang.neev.entity.Industry;
import indi.zyang.neev.entity.Point;
import indi.zyang.neev.service.IndustryService;
import indi.zyang.neev.unit.Edge;
import indi.zyang.neev.unit.GraphData;
import indi.zyang.neev.unit.Node;
import indi.zyang.neev.unit.Tool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class IndustryServiceImpl implements IndustryService {
    @Autowired
    IndustryMapper industryMapper;

    @Autowired
    CompanyMapper companyMapper;

    @Autowired
    DescriptionMapper descriptionMapper;

    @Override
    public Industry findIndustryByIndId(int indId) {
        return industryMapper.findIndustryByIndId(indId);
    }

    @Override
    public Industry findFullIndustryByIndId(int indId) {
        Industry industry = industryMapper.findIndustryByIndId(indId);
        Description description = descriptionMapper.findDescriptionByDesId(indId);
        List<Company> companyList = companyMapper.findCompanyByIndId(indId);
        industry.setDescription(description);
        industry.setCompanyList(companyList);
        return industry;
    }

    //todo IndustryDO结构以重构，按照新结构构造新的方法
    @Override
    @Deprecated
    public GraphData getEChartGraphData(Industry industry) {
        List<Node> nodes = new ArrayList<>();
        List<Edge> edges = new ArrayList<>();
        List<Company> companyList = industry.getCompanyList();

        for(Company company : companyList){
            nodes.add(Tool.buildNode(company.getStringComId(),company.getComName(),company.getCategory()));
            edges.add(Tool.buildEdge(company.getStringComId(),industry.getStringIndId()));
        }
        GraphData data = new GraphData(nodes,edges);
        return data;
    }

    @Override
    public GraphData getEChartGraphData() {
        List<Node> nodes = new ArrayList<>();
        List<Edge> edges = new ArrayList<>();
        List<Industry> industryList = industryMapper.findAllIndustry();
        //build Nodes
        for (Industry industryNode : industryList){
            int size = Tool.convertMarketValueToNodeSize(industryNode.getMarketValue(),100);
            nodes.add(Tool.buildNodeWithFeature(industryNode.getStringIndId(),industryNode.getIndName(),industryNode.getCategory(),size, industryNode.getColor()));
        }
        for (Industry industry : industryList){
            for (Industry upIndustry : industryList){
                if(industry.getIndLevel()+1 == upIndustry.getIndLevel()){
                    if (industry.getUpLevelKey() == upIndustry.getLevelKey()){
                        industry.getUpIndustryList().add(upIndustry);
                    }
                }
            }
            //build Edges
            for (Industry upIndustry : industry.getUpIndustryList()){
                edges.add(Tool.buildEdge(upIndustry.getStringIndId(),industry.getStringIndId()));
            }
        }
        GraphData data = new GraphData(nodes,edges);
        return data;
    }

    public Map<String, String[]> getPointHistorical(List<Point> dataList) {
        // 最终返回的集合
        Map<String, String[]> map = new HashMap<>();
        // 返回的时间的集合
        String[] times = new String[dataList.size()];
        String[] strings;
        List<String> datetimeList = new ArrayList<>();
        for (int i = 0; i < dataList.size(); i++) {
            // 存储时间
            String dates = dataList.get(i).getTime();
            times[i] = dates;
            if (!datetimeList.contains(times[i])) {
                datetimeList.add(times[i]);
            }
        }
        // 将y轴数据存入map
        Map<String, List<Point>> PointDataMapByName = dataList.stream().collect(Collectors.groupingBy(Point::getPoint_name));
        for (Map.Entry<String, List<Point>> stringListEntry : PointDataMapByName.entrySet()) {
            String tagName = stringListEntry.getKey();
            map.put(tagName, getTagVlaues(datetimeList, dataList, tagName));

        }
        strings = datetimeList.toArray(new String[datetimeList.size()]);
        // 将x轴数据存入map
        map.put("time", strings);
        return map;
    }
    /**
     * 存储y轴参数
     **/
    public String[] getTagVlaues(List<String> datetimeList, List<Point> dataList, String tagName) {
        String[] values = new String[dataList.size()];
        for (int i = 0; i < datetimeList.size (); i++) {
            String datetimeStr = datetimeList.get(i);
            Point pointData = dataList.stream().filter(data -> datetimeStr.equals(data.getTime())
                    && tagName.equals(data.getPoint_name())).findFirst().orElse(null);
            if(pointData != null){
                String value = new BigDecimal(pointData.getValue()).setScale(4, BigDecimal.ROUND_DOWN).stripTrailingZeros().toPlainString();
                values[i] = value;
            }else{
                values[i] = "0";
            }
        }
        return values;
    }
}
