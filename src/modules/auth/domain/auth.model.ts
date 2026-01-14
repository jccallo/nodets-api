export interface AuthToken {
   token: string
   expiresIn: string
}

export interface AuthResponse {
   user: {
      id: string
      email: string
      name: string
   }
   token: string
}
