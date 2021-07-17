import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import {AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades){
  return(
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{borderRadius: '8px'}} />
      <hr/>
      <p>
        <a className="boxLink"  href={`https://github.com/${propriedades.githubUser}`} > 
        @{propriedades.githubUser}
        </a>
      </p>
      
      <hr/>

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props){
  return (
    <ProfileRelationsBoxWrapper>
    <h2 className="smallTitle">
      {props.title} ({props.items.length})
    </h2>
    
    <ul>
      {props.items.slice(0,6).map((itemAtual) => {
        
        return (
          <li key={itemAtual.id}> 
           <a
                  href={`https://github.com/${itemAtual.login}`}
                  key={itemAtual.id}
                >
                  <img src={`https://github.com/${itemAtual.login}.png`} />
                  <span>{itemAtual.login}</span>
                </a>
              </li>
            );
          })}
    </ul>  
  </ProfileRelationsBoxWrapper>
  )
}
export default function Home(props) {
React.useState(['Alurakut']);
const usuarioAleatorio = props.githubUser; 
const [comunidades, setComunidades] = React.useState([]);

// const comunidades = ['Alurakut']
const pessoasFavoritas = [
  'juunegreiros',
  'omariosouto',
  'peas',
  'rafaballerini',
  'marcobrunodev',
  'felipefialho',
  'Lucasedqnunes'
]

const [seguidores, setSeguidores] = React.useState([]); 
React.useEffect(function() {
  fetch('https://api.github.com/users/rayanne-barros/followers')
  .then(function(respostaDoServidor){
    return respostaDoServidor.json();
  })
  .then(function(respostaCompleta){
    setSeguidores(respostaCompleta);
  })


  fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      'Authorization': 'a6c5476ab12b0f325735925e5e12d8',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }, 
    body: JSON.stringify({ "query": `query {
      allCommunities{        
        id
        title
        imageUrl
        linkDaComunidade
      }
    }`})      
  })
  .then((response) => response.json()) 
  .then((respostaCompleta) => {
    const comunidadesDoDato = respostaCompleta.data.allCommunities;
    console.log(comunidadesDoDato)
    setComunidades(comunidadesDoDato)
    
  }) 
}, [])

console.log('seguidores antes do return', seguidores);

  return (
    <>
      <AlurakutMenu githubUser={usuarioAleatorio}/>
      <MainGrid>
        <div className="profileArea" style={{gridArea: 'profileArea'}}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>

        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
            <Box >
              <h1 className="title">
                Bem vindo(a)
              </h1>
              <OrkutNostalgicIconSet />
              </Box>
              <Box>
                <h2 className="subTitle"> O que você deseja fazer? </h2>
                <form onSubmit={function handleSubmit(e){
                    e.preventDefault();
                    const dadosDoForm = new FormData(e.target);

                    // console.log('Campo: ', dadosDoForm.get('title'));
                    // console.log('Campo: ', dadosDoForm.get('image'));
                   
                    const comunidade = {
                     
                      title: dadosDoForm.get('title'),
                      imageUrl: dadosDoForm.get('image'),
                      linkDaComunidade:
                      dadosDoForm.get('link')
                    }

                    fetch('/api/comunidades', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(comunidade)
                    })
                    .then(async (response) => {
                      const dados =  await response.json();
                      console.log(dados.registroCriado);
                      const comunidade = dados.registroCriado;
                      const comunidadesAtualizadas = [...comunidades, comunidade];
                      setComunidades(comunidadesAtualizadas)
                    })
                   
                    
                  }}>
                  <div>
                    <input
                       placeholder="Qual o nome da sua comunidade?" name="title" aria-label="Qual o nome da sua comunidade?" type="text" 
                    />
                  </div>

                  <div>
                    <input
                       placeholder="Coloque uma URL para usarmos de capa" name="image" aria-label="Coloque uma URL para usarmos de capa"
                    />
                  </div>
                  <div>
                    <input
                       placeholder="Coloque a URL da sua comunidade " name="link" aria-label="Coloque a URL da sua comunidade"
                    />
                  </div>
                  
                  <button>
                    Criar comunidade
                  </button>
                  
                </form>
              </Box> 
        </div>
        
        <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>

            <ProfileRelationsBox title="Seguidores" items={seguidores} />         
            <ProfileRelationsBoxWrapper>
              <h2 className="smallTitle">
                Pessoas da Comunidade ({pessoasFavoritas.length})
              </h2>
              
              <ul>
                {pessoasFavoritas.slice(0,6).map((itemAtual) => {
                  return (
                    <li key={itemAtual}> 
                      <a href={`/users/${itemAtual}`} >
                        <img src={`https://github.com/${itemAtual}.png`} />
                        <span>{itemAtual}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>             

            </ProfileRelationsBoxWrapper>
            <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
                Comunidades ({comunidades.length})
              </h2>
              <ul>
                  {comunidades.slice(5,11).map((itemAtual) => {
                    return (
                      <li key={itemAtual.id}> 
                        <a href={`${itemAtual.linkDaComunidade}`} >
                           <img src={itemAtual.imageUrl} /> 
                          <span>{itemAtual.title}</span>
                        </a>
                      </li>
                    )
                  })}
                </ul>             

            </ProfileRelationsBoxWrapper>
        </div>     
      
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN;
 
  const { isAuthenticated } = await fetch('https://alurakut1.vercel.app/api/auth', {
    headers: {
        Authorization: token,
      },
  })
  .then((resposta) => resposta.json())

 
  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    }, // will be passed to the page component as props
  }
} 

