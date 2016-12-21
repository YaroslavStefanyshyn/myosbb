package com.softserve.osbb.repository;

import com.softserve.osbb.model.House;
import com.softserve.osbb.model.Osbb;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HouseRepository extends JpaRepository<House, Integer> {

  //  List<House> findByCity(String city);

    List<House> findByStreet(Integer street);

    @Query("select h from House h join h.osbb o where o.osbbId = :osbbId")
    List<House> findByOsbbId(@Param("osbbId") Integer osbbId);

    Page<House> findByOsbb(Osbb osbb, Pageable pageable);
}
