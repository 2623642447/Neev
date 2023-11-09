package indi.zyang.neev.service;

import indi.zyang.neev.entity.Description;

import java.util.HashMap;
import java.util.List;

public interface DescriptionService {
    /**
      * @Author Zyang
      * @Desctription 传入Entity节点id，返回对应节点的描述信息和统计数据
      * @Date 2023/11/3 16:07
      * @Param [entityId]
      * @return java.util.List<java.util.HashMap<java.lang.String,java.lang.String>>
      */
    HashMap<String, Object>  getEntityDesByEntityId(int entityId);
}
