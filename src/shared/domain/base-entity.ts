export interface BaseProps {
   id?: number | string
   createdAt?: Date
   updatedAt?: Date
   deletedAt?: Date
}

export abstract class BaseEntity<T extends BaseProps> {
   public readonly props: T

   constructor(props: T) {
      this.props = props
   }

   public static create<T extends BaseEntity<any>>(this: new (props: any) => T, props: any): T {
      return new this(props)
   }

   get id() {
      return this.props.id ?? null
   }
   get createdAt() {
      return this.props.createdAt ?? null
   }
   get updatedAt() {
      return this.props.updatedAt ?? null
   }
   get deletedAt() {
      return this.props.deletedAt ?? null
   }

   public equals(object?: BaseEntity<T>): boolean {
      if (!object) return false
      if (this === object) return true
      return this.id === object.id
   }
}
