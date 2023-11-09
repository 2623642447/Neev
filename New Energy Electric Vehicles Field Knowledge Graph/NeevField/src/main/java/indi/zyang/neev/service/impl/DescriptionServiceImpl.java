package indi.zyang.neev.service.impl;

import indi.zyang.neev.dao.DescriptionMapper;
import indi.zyang.neev.entity.Description;
import indi.zyang.neev.service.DescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public class DescriptionServiceImpl implements DescriptionService {
    @Autowired
    DescriptionMapper descriptionMapper;

    @Override
    public HashMap<String, Object> getEntityDesByEntityId(int entityId) {
        List<Description> desList = descriptionMapper.getDesByEntityId(entityId);
        HashMap<String, Object> resultMap = new HashMap<>();
        //目前只拿第一个
        Description des = desList.get(0);
        if(des.getIsContain() == 0){
            resultMap.put("content",des.getContent());
            resultMap.put("desname",des.getDesName());
            resultMap.put("isContain",des.getIsContain());
            resultMap.put("echartDate",null);
            resultMap.put("echartData",null);
        }else{
            resultMap.put("content",des.getContent());
            resultMap.put("desname",des.getDesName());
            resultMap.put("unit",des.getUnit());
            resultMap.put("isContain",des.getIsContain());
            int desId = des.getDesId();
            List<String> echartDate = descriptionMapper.getDesDateByDesId(desId);
            List<String> echartData = descriptionMapper.getDesDataByDesId(desId);
            resultMap.put("echartDate",echartDate);
            resultMap.put("echartData",echartData);
        }
        return resultMap;
    }
}
