export class Post {
   public id?: string
   public title: string
   public content: string
   public userId: string
   public published: boolean
   public createdAt?: Date
   public updatedAt?: Date

   constructor(props: {
      title: string
      content: string
      userId: string
      published: boolean
      id?: string
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
