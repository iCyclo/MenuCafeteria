package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Table(name = "categorias")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Categoria implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private int id;

    @Column
    private String nombre;

    @Column
    private byte[] imagen;

    @JsonIgnore
    @OneToMany(mappedBy = "categoria")
    private List<Producto> productos;

}
