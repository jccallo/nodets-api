import { Aggregate, ID, Result, EntityProps, UID } from 'types-ddd'

export type PostProps = EntityProps & {
   title: string
   content: string
   userId: string
   published: boolean
   id?: string
   createdAt?: Date
   updatedAt?: Date
}

export class Post extends Aggregate<PostProps> {
   private constructor(props: PostProps) {
      super(props)
   }

   public static create(props: PostProps, id?: UID<string>): Result<Post> {
      return Result.Ok(new Post({ ...props, id: id?.value() }))
   }

   get title(): string {
      return this.props.title
   }
   get content(): string {
      return this.props.content
   }
   get userId(): string {
      return this.props.userId
   }
   get published(): boolean {
      return this.props.published
   }
}
