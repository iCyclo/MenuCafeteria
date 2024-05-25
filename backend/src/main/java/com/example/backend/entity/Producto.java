package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Table(name = "productos")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})  
public class Producto implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;

    @Column
    private String nombre;

    @Column
    private double precio;

    @Column
    private String descripcion;

}