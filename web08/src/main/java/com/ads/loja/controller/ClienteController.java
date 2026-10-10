package com.ads.loja.controller;

import com.ads.loja.entity.Cliente;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ConcurrentMap<Long, Cliente> clientes = new ConcurrentHashMap<>();
    private final AtomicLong proximoId = new AtomicLong(1);

    @GetMapping
    public List<Cliente> listarClientes() {
        return List.copyOf(clientes.values());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarCliente(@PathVariable Long id) {
        Cliente cliente = clientes.get(id);
        return cliente == null
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(cliente);
    }

    @PostMapping
    public ResponseEntity<Cliente> criarCliente(@RequestBody Cliente cliente) {
        cliente.setId(proximoId.getAndIncrement());
        clientes.put(cliente.getId(), cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(cliente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> atualizarCliente(
            @PathVariable Long id,
            @RequestBody Cliente cliente) {
        cliente.setId(id);
        return clientes.replace(id, cliente) == null
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(cliente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirCliente(@PathVariable Long id) {
        if (clientes.remove(id) == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
