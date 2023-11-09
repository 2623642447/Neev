package indi.zyang.neev.dao;

import indi.zyang.neev.entity.Description;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DescriptionMapper {
    /**
      * @Author Zyang
      * @Desctription
      * @Date 2023/4/6 18:53
      * @Param [desId]
      * @return indi.zyang.neev.entity.Description
      */
    @Deprecated
    Description findDescriptionByDesId(@Param("desId") int desId);


    /**
      * @Author Zyang
      * @Desctription 获取des基本信息
      * @Date 2023/11/3 16:12
      * @Param [entityId]
      * @return java.util.List<java.lang.String>
      */
    List<Description> getDesByEntityId(@Param("entityId") int entityId);

    /**
      * @Author Zyang
      * @Desctription 获取有序data数据
      * @Date 2023/11/4 11:02
      * @Param [desId]
      * @return java.util.List<java.lang.String>
      */
    List<String> getDesDataByDesId(@Param("desId") int desId);

    /**
      * @Author Zyang
      * @Desctription 获取有序date数据
      * @Date 2023/11/4 11:02
      * @Param [desId]
      * @return java.util.List<java.lang.String>
      */
    List<String> getDesDateByDesId(@Param("desId") int desId);
}
