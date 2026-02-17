# 🧪 Testing Guide - Service Orders

## ⚡ Instrucciones Rápidas

### 1️⃣ Instalar dependencias de test
```bash
npm install
```

### 2️⃣ Ejecutar TODOS los tests
```bash
npm test
```

### 3️⃣ Ejecutar tests en modo watch (se recargan automáticamente)
```bash
npm run test:watch
```

### 4️⃣ Ver cobertura de código
```bash
npm run test:coverage
```

---

## 📚 Qué Se Testea

### Unit Tests (Reglas de Transición)
**Archivo:** `tests/unit/service-order-transitions.test.js`

**Qué testea:**
- ✅ Transiciones válidas: PENDING→IN_PROGRESS, IN_PROGRESS→COMPLETED, etc.
- ❌ Transiciones bloqueadas: COMPLETED→IN_PROGRESS, CANCELLED→*
- 📊 Matriz completa de 16 transiciones

**Comandos específicos:**
```bash
npm test -- service-order-transitions.test.js
npm test -- service-order-transitions.test.js --verbose
```

### Integration Tests (Ciclo Completo)
**Archivo:** `tests/integration/service-order-status.integration.test.js`

**Qué testea:**
- 📝 Ciclo de vida completo de una orden
- 🚫 Manejo de errores de negocio
- ✅ Operaciones válidas
- ⏱️ Validación de timestamps

**Comandos específicos:**
```bash
npm test -- service-order-status.integration.test.js
npm test -- integration
```

---

## 🎯 Qué Significan los Resultados

### ✅ PASS (Verde)
```
✓ PENDING -> IN_PROGRESS debe ser válido
✓ IN_PROGRESS -> COMPLETED debe ser válido
```
Los tests pasaron = La regla funciona correctamente

### ❌ FAIL (Rojo)
```
✕ COMPLETED -> IN_PROGRESS debe lanzar error
  Error: Expected error but none was thrown
```
El test falló = Hay un bug en la lógica

### 📊 Resumen final
```
Tests:       25 passed, 0 failed, 25 total
Snapshots:   0 total
Duration:    1.234s
```

---

## 🔧 Casos más Comunes

### Ejecutar solo tests de transiciones inválidas
```bash
npm test -- service-order-transitions.test.js -t "Transiciones no permitidas"
```

### Ejecutar solo tests de errores
```bash
npm test -- -t "Errores de negocio"
```

### Ejecutar solo el ciclo de vida completo
```bash
npm test -- -t "Ciclo de vida completo"
```

### Ver qué pasó exactamente en un test específico
```bash
npm test -- service-order-transitions.test.js --verbose
```

---

## 📝 Ejemplo de Salida Esperada

```
 PASS  tests/unit/service-order-transitions.test.js
  Service Order - Reglas de Transición
    ✅ Transiciones permitidas
      ✓ PENDING -> IN_PROGRESS debe ser válido (2ms)
      ✓ PENDING -> COMPLETED debe ser válido (1ms)
      ✓ PENDING -> CANCELLED debe ser válido (1ms)
      ✓ IN_PROGRESS -> COMPLETED debe ser válido (1ms)
      ✓ IN_PROGRESS -> CANCELLED debe ser válido (1ms)
      ✓ COMPLETED -> CANCELLED debe ser válido (1ms)
    ❌ Transiciones no permitidas
      ✓ COMPLETED -> IN_PROGRESS debe lanzar error (1ms)
      ✓ CANCELLED -> PENDING debe lanzar error (1ms)
      ✓ CANCELLED -> IN_PROGRESS debe lanzar error (1ms)
      ✓ CANCELLED -> COMPLETED debe lanzar error (1ms)
      ✓ CANCELLED -> CANCELLED debe lanzar error (1ms)

 PASS  tests/integration/service-order-status.integration.test.js
  Service Order - Integración de Cambios de Estado
    📝 Ciclo de vida completo de una orden
      ✓ Orden completa ciclo: PENDING -> IN_PROGRESS -> COMPLETED (3ms)
      ✓ Orden puede ser cancelada en cualquier momento antes de COMPLETED (1ms)

Test Suites: 2 passed, 2 total
Tests:       25 passed, 25 total
```

---

## 🚀 Tips Profesionales

1. **Ejecuta antes de cada commit:**
   ```bash
   npm test
   ```

2. **En modo desarrollo (se recarga automáticamente):**
   ```bash
   npm run test:watch
   ```

3. **Para ver cuánto código se está testeando:**
   ```bash
   npm run test:coverage
   ```

4. **Si no funciona algo, borra node_modules y reinstala:**
   ```bash
   rm -r node_modules package-lock.json
   npm install
   npm test
   ```

---

## ✨ States Válidos

```
PENDING ──→ IN_PROGRESS ──→ COMPLETED
   ↓           ↓              ↓
   └────→ CANCELLED ←────────→
   
❌ No permitido:
- COMPLETED → IN_PROGRESS (regresión)
- CANCELLED → * (estado final)
```

---

¡Listo! Los tests están diseñados para ser **super simples** y **muy fáciles de ejecutar**. 🎉
