/**
 * Unit Tests: Reglas de Transición de Service Orders
 * 
 * PROPÓSITO: Validar que las transiciones entre estados respeten las reglas de negocio
 * COMANDOS:
 *   npm test -- service-order-transitions.test.js
 */

const CustomError = require('../../utils/custom-error');

/**
 * Función que valida transiciones de estado
 * (Simulación de la lógica en service-order.service.js)
 */
function validateTransition(currentStatus, newStatus) {
  // Regla 1: No permitir cambios si la orden está CANCELLED
  if (currentStatus === 'CANCELLED') {
    throw new CustomError('No se pueden realizar cambios: la orden está CANCELLED', 400);
  }

  // Regla 2: No permitir COMPLETED -> IN_PROGRESS
  if (currentStatus === 'COMPLETED' && newStatus === 'IN_PROGRESS') {
    throw new CustomError('Transición inválida: no se permite COMPLETED -> IN_PROGRESS', 400);
  }

  // Si pasó ambas validaciones, la transición es permitida
  return true;
}

/**
 * ==========================================
 * PRUEBAS UNITARIAS
 * ==========================================
 */

describe('Service Order - Reglas de Transición', () => {
  
  // ✅ TRANSICIONES VÁLIDAS
  describe('✅ Transiciones permitidas', () => {
    
    test('PENDING -> IN_PROGRESS debe ser válido', () => {
      expect(() => validateTransition('PENDING', 'IN_PROGRESS')).not.toThrow();
    });

    test('PENDING -> COMPLETED debe ser válido', () => {
      expect(() => validateTransition('PENDING', 'COMPLETED')).not.toThrow();
    });

    test('PENDING -> CANCELLED debe ser válido', () => {
      expect(() => validateTransition('PENDING', 'CANCELLED')).not.toThrow();
    });

    test('IN_PROGRESS -> COMPLETED debe ser válido', () => {
      expect(() => validateTransition('IN_PROGRESS', 'COMPLETED')).not.toThrow();
    });

    test('IN_PROGRESS -> CANCELLED debe ser válido', () => {
      expect(() => validateTransition('IN_PROGRESS', 'CANCELLED')).not.toThrow();
    });

    test('COMPLETED -> CANCELLED debe ser válido', () => {
      expect(() => validateTransition('COMPLETED', 'CANCELLED')).not.toThrow();
    });
  });

  // ❌ TRANSICIONES INVÁLIDAS
  describe('❌ Transiciones no permitidas', () => {
    
    test('COMPLETED -> IN_PROGRESS debe lanzar error', () => {
      expect(() => validateTransition('COMPLETED', 'IN_PROGRESS')).toThrow(
        'Transición inválida: no se permite COMPLETED -> IN_PROGRESS'
      );
    });

    test('CANCELLED -> PENDING debe lanzar error', () => {
      expect(() => validateTransition('CANCELLED', 'PENDING')).toThrow(
        'No se pueden realizar cambios: la orden está CANCELLED'
      );
    });

    test('CANCELLED -> IN_PROGRESS debe lanzar error', () => {
      expect(() => validateTransition('CANCELLED', 'IN_PROGRESS')).toThrow(
        'No se pueden realizar cambios: la orden está CANCELLED'
      );
    });

    test('CANCELLED -> COMPLETED debe lanzar error', () => {
      expect(() => validateTransition('CANCELLED', 'COMPLETED')).toThrow(
        'No se pueden realizar cambios: la orden está CANCELLED'
      );
    });

    test('CANCELLED -> CANCELLED debe lanzar error', () => {
      expect(() => validateTransition('CANCELLED', 'CANCELLED')).toThrow(
        'No se pueden realizar cambios: la orden está CANCELLED'
      );
    });
  });

  // 📊 MATRIZ DE TRANSICIONES
  describe('📊 Matriz completa de transiciones', () => {
    const estados = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    
    // Basado en las reglas de negocio:
    // 1. No se puede cambiar si está CANCELLED
    // 2. No se permite COMPLETED -> IN_PROGRESS
    // Todo lo demás está permitido
    const transicionesValidas = [
      ['PENDING', 'IN_PROGRESS'],
      ['PENDING', 'COMPLETED'],
      ['PENDING', 'CANCELLED'],
      ['IN_PROGRESS', 'PENDING'],        // Permitido
      ['IN_PROGRESS', 'COMPLETED'],      // Permitido
      ['IN_PROGRESS', 'CANCELLED'],      // Permitido
      ['COMPLETED', 'PENDING'],          // Permitido (no hay regla que lo impida)
      ['COMPLETED', 'CANCELLED'],        // Permitido
    ];

    test('Todas las transiciones válidas deben permitirse', () => {
      transicionesValidas.forEach(([from, to]) => {
        expect(() => validateTransition(from, to)).not.toThrow(
          `Debería permitirse transición ${from} -> ${to}`
        );
      });
    });

    test('Las transiciones inválidas deben bloquearse', () => {
      const transicionesInvalidas = [
        ['COMPLETED', 'IN_PROGRESS'],  // Regresión no permitida
        ['CANCELLED', 'PENDING'],      // No cambios desde CANCELLED
        ['CANCELLED', 'IN_PROGRESS'],  // No cambios desde CANCELLED
        ['CANCELLED', 'COMPLETED'],    // No cambios desde CANCELLED
        ['CANCELLED', 'CANCELLED'],    // No cambios desde CANCELLED
      ];

      transicionesInvalidas.forEach(([from, to]) => {
        expect(() => validateTransition(from, to)).toThrow();
      });
    });
  });
});
