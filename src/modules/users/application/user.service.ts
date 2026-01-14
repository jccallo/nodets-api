import { User, CreateUserDTO } from '../domain/user.model'
import { httpClient, HttpClient } from '../../../shared/infrastructure/http'
import { ExternalUserDTO } from '../infrastructure/user-external.dto'
import { UserMapper } from '../infrastructure/user.mapper'

export class UserService {
  private users: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin',
      createdAt: new Date(),
    },
  ]

  constructor(private http: HttpClient = httpClient) {}

  async getAll(): Promise<User[]> {
    return this.users
  }

  async getExternalUsers(): Promise<User[]> {
    // Ejemplo Senior: Consumimos la API externa
    // No necesitamos pasar headers aquí, el interceptor los inyectará automáticamente
    const rawUsers = await this.http.get<ExternalUserDTO[]>('https://jsonplaceholder.typicode.com/users')

    // MAPEAMOS a nuestro dominio. La lógica de negocio solo recibe entidades User.
    return UserMapper.toDomainList(rawUsers)
  }

  simulateLogin(token: string) {
    // Establecemos el token de forma global
    this.http.setToken(token)
  }

  async getExternalPosts() {
    // Ejemplo demostrativo de uso de HttpClient (Senior Level)
    // Ya no necesitas acceder a .data, el adaptador lo hace por ti
    const posts = await this.http.get<any[]>('https://jsonplaceholder.typicode.com/posts?_limit=5')
    return posts
  }

  async create(data: CreateUserDTO): Promise<User> {
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      ...data,
      createdAt: new Date(),
    }
    this.users.push(newUser)
    return newUser
  }
}
