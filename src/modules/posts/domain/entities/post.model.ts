export class Post {
   public id?: number | string
   public title: string
   public content: string
   public userId: number | string
   public published: boolean
   public createdAt?: Date
   public updatedAt?: Date

   constructor(props: {
      title: string
      content: string
      userId: number | string
      published: boolean
      id?: number | string
      createdAt?: Date
      updatedAt?: Date
   }) {
      this.id = props.id
      this.title = props.title
      this.content = props.content
      this.userId = props.userId
      this.published = props.published
      this.createdAt = props.createdAt
      this.updatedAt = props.updatedAt
   }
}
