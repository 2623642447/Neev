package indi.zyang.neev.controller;

import indi.zyang.neev.entity.Industry;
import indi.zyang.neev.service.DescriptionService;
import indi.zyang.neev.service.IndustryService;
import indi.zyang.neev.unit.GraphData;
import indi.zyang.neev.unit.Tool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("industry")
public class IndustryController {
    @Autowired
    IndustryService industryService;

    @Autowired
    DescriptionService descriptionService;

    @RequestMapping("/{id}")
    @ResponseBody
    public Map<String, Object> getIndustryInfo(@PathVariable("id") int indId){
        Industry industry = industryService.findFullIndustryByIndId(indId);
        GraphData data = industryService.getEChartGraphData();
        List<HashMap<String,String>> relationGraphNodesList = industryService.getRelationGraphNodes();
        List<HashMap<String,String>> relationGraphLinesList = industryService.getRelationGraphLines();
        return Tool.formatNewData(industry,data,"industry",relationGraphNodesList,relationGraphLinesList);
    }

    //todo 解决append传入id情况
    @RequestMapping("/append/{id}")
    @ResponseBody
    public Map<String, Object> appendIndustryInfo(@PathVariable("id") int indId){
        Industry industry = industryService.findFullIndustryByIndId(indId);
        GraphData data = industryService.getEChartGraphData(industry);
        return Tool.formatData(industry,data,"industry");
    }

    @RequestMapping(value = "/neev")
    @ResponseBody
    public Map<String, Object> neevIndustry(){
        Industry industry = industryService.findFullIndustryByIndId(20001);
        GraphData data = industryService.getEChartGraphData(industry);
        List<HashMap<String,String>> relationGraphNodesList = industryService.getRelationGraphNodes();
        List<HashMap<String,String>> relationGraphLinesList = industryService.getRelationGraphLines();
        return Tool.formatNewData(industry,data,"industry",relationGraphNodesList,relationGraphLinesList);
    }

    @RequestMapping(value = "/description/{id}")
    @ResponseBody
    public Map<String, Object> getEntityDescription(@PathVariable("id") int indId){
        return descriptionService.getEntityDesByEntityId(indId);
    }
}
