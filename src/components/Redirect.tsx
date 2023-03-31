import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
type RedirectUlr = {
    to: string
}

export default function Redirect({ to }: RedirectUlr) {
    const navigate = useNavigate()
    useEffect(() => {
        navigate(to, { replace: true })
    })
    return null
}