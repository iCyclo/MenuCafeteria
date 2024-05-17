package com.example.backend.controller;

import com.example.backend.entity.Categoria;
import com.example.backend.entity.Producto;
import com.example.backend.repository.CategoriaRepository;
import com.example.backend.repository.ProductoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("cafeteria")
@RequiredArgsConstructor
public class MenuController {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    @GetMapping("ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong :: ".concat(LocalDateTime.now().toString()));
    }

    @GetMapping("productos")
    public ResponseEntity<List<Producto>> getProductos() {
        return ResponseEntity.ok(productoRepository.findAll());
    }

    @GetMapping("categorias")
    public ResponseEntity<List<Categoria>> getCategories() {
        return ResponseEntity.ok(categoriaRepository.findAll());
    }

    @GetMapping("filtrar-productos")
    public ResponseEntity<List<Producto>> filtrarProductos(@RequestParam String categoria) {
        return ResponseEntity.ok(productoRepository.findByCategoriaNombre(categoria));
    }

    @PostMapping("guardar-categoria")
    @Transactional
    public ResponseEntity<String> guardarCategoria(@RequestBody Categoria categoria) {
        if(categoria.getId() != 0)
            categoria = categoriaRepository.getReferenceById(categoria.getId());
        categoria = categoriaRepository.save(categoria);
        return ResponseEntity.ok("Se ha guardado la categoría: ".concat(categoria.getNombre()));
    }

    @PostMapping("guardar-producto")
    @Transactional
    public ResponseEntity<String> guardarProducto(@RequestBody Producto producto) {
        if(producto.getId() != 0)
            producto = productoRepository.getReferenceById(producto.getId());
        var categoria = categoriaRepository.getReferenceById(producto.getCategoria().getId());
        producto.setCategoria(categoria);
        producto = productoRepository.save(producto);
        return ResponseEntity.ok("Se ha guardado el producto: ".concat(producto.getNombre()));
    }

    @DeleteMapping("eliminar-producto/{id}")
    public void eliminarProducto(@PathVariable int id) {
        productoRepository.deleteById(id);
    }

    @DeleteMapping("eliminar-categoria/{id}")
    public void eliminarCategoria(@PathVariable int id) {
        categoriaRepository.deleteById(id);
    }
}