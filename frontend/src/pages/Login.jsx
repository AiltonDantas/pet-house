import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { LogIn, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import api from '../services/api'
import petHouseImg from '../assets/Pet_house.png'
import logo from '../assets/logo.png'

export default function Login() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useApp()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email: data.email, senha: data.senha })
      login(res.data)
      navigate('/dashboard')
    } catch (err) {
      setError('email', { message: err.message || 'Email ou senha invalidos' })
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', backgroundColor:'#eef5e8', fontFamily:"'Nunito', sans-serif", overflow:'hidden' }}>

      {/* Painel esquerdo — imagem */}
      <div style={{ flex:'0 0 52%', position:'relative', display:'none' }} className="login-left">
        <img src={petHouseImg} alt="Pet House"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, transparent 55%, #eef5e8 100%)' }} />
      </div>

      {/* Painel direito — form */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 40px', backgroundColor:'#eef5e8', position:'relative' }}>

        {/* Círculos decorativos */}
        <div style={{ position:'absolute', top:-80, right:-80, width:280, height:280, backgroundColor:'#8cc63f', borderRadius:'50%', opacity:0.15 }} />
        <div style={{ position:'absolute', bottom:-60, left:-60, width:200, height:200, backgroundColor:'#2e964e', borderRadius:'50%', opacity:0.1 }} />

        <div style={{ width:'100%', maxWidth:400, position:'relative', zIndex:1 }}>

          {/* Logo */}
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{
              width:80, height:80,
              background:'linear-gradient(135deg, #2e964e 0%, #4cb86a 100%)',
              borderRadius:22, display:'flex', alignItems:'center', justifyContent:'center',
              margin:'0 auto 14px', boxShadow:'0 8px 24px rgba(46,150,78,0.35)',
              padding:14,
            }}>
              <img
                src={logo}
                alt="Pet House"
                style={{ width:'100%', height:'100%', objectFit:'contain', filter:'brightness(0) invert(1)' }}
              />
            </div>
            <h1 style={{ fontSize:30, fontWeight:900, color:'#1a5c2a', letterSpacing:'-0.5px', margin:0, lineHeight:1 }}>PET HOUSE</h1>
            <p style={{ fontSize:13, color:'#5a8a4a', marginTop:6, fontWeight:600 }}>Cuidando da vida de quem te faz feliz!</p>
          </div>

          {/* Card */}
          <div style={{ backgroundColor:'#ffffff', borderRadius:24, padding:'36px 32px', boxShadow:'0 16px 48px rgba(46,150,78,0.12), 0 4px 16px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize:22, fontWeight:800, color:'#1a3a2a', marginBottom:4 }}>Bem-vindo!</h2>
            <p style={{ fontSize:13, color:'#8a9a8a', marginBottom:26 }}>Acesse o sistema com suas credenciais</p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:800, color:'#3a5a3a', marginBottom:6, letterSpacing:'0.5px', textTransform:'uppercase' }}>Email</label>
                <input type="email" placeholder="seu@email.com"
                  style={{ width:'100%', boxSizing:'border-box', padding:'12px 14px', borderRadius:12, border: errors.email ? '2px solid #ef4444' : '2px solid #ddeedd', backgroundColor:'#f8fcf8', fontSize:14, color:'#1a3a2a', outline:'none', fontFamily:'inherit' }}
                  {...register('email', { required: 'Email obrigatorio' })} />
                {errors.email && <p style={{ color:'#ef4444', fontSize:12, marginTop:4 }}>{errors.email.message}</p>}
              </div>

              <div style={{ marginBottom:24 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:800, color:'#3a5a3a', marginBottom:6, letterSpacing:'0.5px', textTransform:'uppercase' }}>Senha</label>
                <div style={{ position:'relative' }}>
                  <input type={showPass ? 'text' : 'password'} placeholder="••••••••"
                    style={{ width:'100%', boxSizing:'border-box', padding:'12px 44px 12px 14px', borderRadius:12, border:'2px solid #ddeedd', backgroundColor:'#f8fcf8', fontSize:14, color:'#1a3a2a', outline:'none', fontFamily:'inherit' }}
                    {...register('senha', { required: 'Senha obrigatoria' })} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#8aaa8a', padding:0 }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{ width:'100%', padding:'14px', borderRadius:12, border:'none', background: loading ? '#a8d4a8' : 'linear-gradient(135deg, #2e964e 0%, #4cb86a 100%)', color:'#fff', fontSize:15, fontWeight:800, cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow: loading ? 'none' : '0 6px 20px rgba(46,150,78,0.4)', fontFamily:'inherit' }}>
                {loading
                  ? <div style={{ width:18, height:18, border:'2.5px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
                  : <LogIn size={18} />}
                {loading ? 'Entrando...' : 'Entrar no Sistema'}
              </button>
            </form>
          </div>

          {/* Demo users */}
          <div style={{ marginTop:18, padding:'14px 18px', backgroundColor:'rgba(255,255,255,0.7)', borderRadius:16, border:'1px solid rgba(46,150,78,0.15)' }}>
            <p style={{ fontSize:10, fontWeight:800, color:'#8aaa8a', letterSpacing:'1px', textTransform:'uppercase', marginBottom:8 }}>Usuarios de demonstracao</p>
            {[
              { email:'admin@pethouse.com',   cargo:'Administrador' },
              { email:'roberto@pethouse.com', cargo:'Recepcionista' },
              { email:'carlos@pethouse.com',  cargo:'Veterinario'   },
            ].map(u => (
              <div key={u.email} style={{ display:'flex', alignItems:'center', gap:8, paddingBottom:5 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', backgroundColor:'#4cb86a', flexShrink:0 }} />
                <span style={{ fontSize:12, color:'#4a6a4a', fontWeight:600 }}>{u.email}</span>
                <span style={{ fontSize:11, color:'#aaa', fontFamily:'monospace' }}>/ 123456</span>
                <span style={{ fontSize:10, color:'#2e964e', backgroundColor:'#e8f5e8', padding:'2px 8px', borderRadius:20, fontWeight:700, marginLeft:'auto' }}>{u.cargo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 1024px) { .login-left { display: block !important; } }
      `}</style>
    </div>
  )
}
