interface ValueObjectProps {
   [index: string]: any
}

/**
 * @desc Los Value Objects son objetos que se comparan por sus propiedades en lugar de un ID único.
 * Son inmutables por naturaleza.
 */
export abstract class ValueObject<T extends ValueObjectProps> {
   public readonly props: T

   constructor(props: T) {
      this.props = Object.freeze(props)
   }

   public equals(vo?: ValueObject<T>): boolean {
      if (vo === null || vo === undefined) {
         return false
      }
      if (vo.props === undefined) {
         return false
      }
      return JSON.stringify(this.props) === JSON.stringify(vo.props)
   }
}
