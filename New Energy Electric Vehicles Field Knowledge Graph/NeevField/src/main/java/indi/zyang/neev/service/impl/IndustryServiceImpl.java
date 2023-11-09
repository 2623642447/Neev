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
        List<Company> companyList = companyMapper.findCompanyByIndId(indId);
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

    @Override
    public List<HashMap<String,String>> getRelationGraphNodes(){
        List<HashMap<String,String>> relationGraphNodesList = new ArrayList<>();
        List<Industry> industryList = industryMapper.findAllIndustry();
        //遍历industryList将industry entity中的indId和IndName装入
        for (Industry industryNode : industryList){
            HashMap<String,String> relationGraphNodeMap = new HashMap<>();
            String id = industryNode.getStringIndId();
            String text = industryNode.getIndName();
            String color = industryNode.getColor();
            relationGraphNodeMap.put("id", id);
            relationGraphNodeMap.put("text",text);
            relationGraphNodeMap.put("color",color);
            relationGraphNodesList.add(relationGraphNodeMap);
        }
        return relationGraphNodesList;
    }

    @Override
    public List<HashMap<String,String>> getRelationGraphLines(){
        List<HashMap<String,String>> relationGraphLinesList = new ArrayList<>();
        List<Industry> industryList = industryMapper.findAllIndustry();
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
                HashMap<String,String> relationGraphLineMap = new HashMap<>();
                String to = upIndustry.getStringIndId();
                String from = industry.getStringIndId();
                relationGraphLineMap.put("from",from);
                relationGraphLineMap.put("to",to);
                relationGraphLinesList.add(relationGraphLineMap);
            }
        }
        return relationGraphLinesList;
    }

}
