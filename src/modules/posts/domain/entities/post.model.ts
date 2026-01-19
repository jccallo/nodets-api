import { BaseEntity, BaseProps } from '@/shared/domain/base-entity'

export interface PostProps extends BaseProps {
   title: string
   content: string
   userId: number | string
   published: boolean
}

export class Post extends BaseEntity<PostProps> {
   get title(): string {
      return this.props.title
   }
   get content(): string {
      return this.props.content
   }
   get userId(): number | string {
      return this.props.userId
   }
   get published(): boolean {
      return this.props.published
   }
}
