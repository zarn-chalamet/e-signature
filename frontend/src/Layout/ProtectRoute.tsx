import React, { type ReactNode } from 'react'

interface ProtectedRouteProps {
  children?: ReactNode;
}

const ProtectRoute: React.FC<ProtectedRouteProps> = ({children}) => {
  return (
    <div>ProtectRoute</div>
  )
}

export default ProtectRoute