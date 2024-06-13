package com.example.backend.controller;

import com.example.backend.entity.Categoria;
import com.example.backend.entity.Producto;
import com.example.backend.repository.CategoriaRepository;
import com.example.backend.repository.ProductoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("cafeteria")
@CrossOrigin(origins = "*") 
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

    @GetMapping("categoria-por-nombre")
    public ResponseEntity<Categoria> getCategoriaPorNombre(@RequestParam String nombre) {
        Categoria categoria = categoriaRepository.findByNombre(nombre);
        if (categoria != null) {
            return ResponseEntity.ok(categoria);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("filtrar-productos")
    public ResponseEntity<List<Producto>> filtrarProductos(@RequestParam String categoria) {
        return ResponseEntity.ok(productoRepository.findByCategoriaNombre(categoria));
    }

    @PostMapping("guardar-categoria")
@Transactional
public ResponseEntity<String> guardarCategoria(@RequestBody Categoria categoria) {
    try {
        // Validación básica
        if (categoria == null || categoria.getNombre() == null || categoria.getNombre().isEmpty()) {
            return ResponseEntity.badRequest().body("Datos de la categoría no válidos");
        }

        // Si la categoría tiene un ID, intentamos buscarla para actualizar
        if (categoria.getId() != 0) {
            Optional<Categoria> existingCategoria = categoriaRepository.findById(categoria.getId());
            if (existingCategoria.isPresent()) {
                // Actualizar la categoría existente
                Categoria categoriaToUpdate = existingCategoria.get();
                categoriaToUpdate.setNombre(categoria.getNombre());
                categoriaToUpdate.setImagen(categoria.getImagen());
                // Aquí puedes actualizar otros campos si los hay
                categoria = categoriaRepository.save(categoriaToUpdate);
            } else {
                // Si no existe, devolver un error o manejar como nuevo
                return ResponseEntity.badRequest().body("La categoría con el ID especificado no existe");
            }
        } else {
            // Guardar nueva categoría
            categoria = categoriaRepository.save(categoria);
        }

        return ResponseEntity.ok("Se ha guardado la categoría: " + categoria.getNombre());

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Ocurrió un error al guardar la categoría: " + e.getMessage());
    }
}

@PostMapping("guardar-producto")
@Transactional
public ResponseEntity<String> guardarProducto(@RequestBody Producto producto) {
    try {
        // Validación básica
        if (producto == null || producto.getNombre() == null || producto.getNombre().isEmpty()) {
            return ResponseEntity.badRequest().body("Datos del producto no válidos");
        }

        // Manejo de actualizaciones
        if (producto.getId() != 0) {
            Optional<Producto> existingProducto = productoRepository.findById(producto.getId());
            if (existingProducto.isPresent()) {
                Producto productoToUpdate = existingProducto.get();
                productoToUpdate.setNombre(producto.getNombre());
                productoToUpdate.setDescripcion(producto.getDescripcion());
                productoToUpdate.setPrecio(producto.getPrecio());
                producto = productoRepository.save(productoToUpdate);
            } else {
                return ResponseEntity.badRequest().body("El producto con el ID especificado no existe");
            }
        } else {
            // Guardar nuevo producto
            var categoria = categoriaRepository.findById(producto.getCategoria().getId());
            if (categoria.isPresent()) {
                producto.setCategoria(categoria.get());
                producto = productoRepository.save(producto);
            } else {
                return ResponseEntity.badRequest().body("La categoría con el ID especificado no existe");
            }
        }

        return ResponseEntity.ok("Se ha guardado el producto: " + producto.getNombre());

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Ocurrió un error al guardar el producto: " + e.getMessage());
    }
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