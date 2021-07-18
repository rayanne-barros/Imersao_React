import React from 'react';

import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import DepBox from '../src/components/DepBox';
import {AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(props){
  return(
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} style={{borderRadius: '8px'}} />
      <hr/>
      <p>
        <a className="boxLink"  href={`https://github.com/${props.githubUser}`} > 
        @{props.githubUser}
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
                   <a href={`https://github.com/${itemAtual.title}`} key={itemAtual.id}>
                          <img src={`${itemAtual.avatarUrl}`}></img>
                          <span>{itemAtual.title}</span>
                   </a>
            </li>
            );
          })}
    </ul>  
  </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {
// React.useState(['Alurakut']);
const githubUser = props.githubUser; 
const [comunidades, setComunidades] = React.useState([]);
const [seguidores, setSeguidores] = React.useState([]);
const [seguindo, setSeguindo] = React.useState([]);
const [mensagens, setMensagens] = React.useState([]);

React.useEffect(() => {
    if(githubUser){
      fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then(res => res.json())
      .then(datas =>  {
            const seguidoresArray = datas.map((data) => {
              return {
                title: data.login,
                avatarUrl: data.avatar_url,
                id: data.id
              }
             //console.log(datas)
            })
            setSeguidores(seguidoresArray)
          })     
  }

    if(githubUser){
      fetch (`https://api.github.com/users/${githubUser}/following`)  
      .then(res => res.json())
      .then(datas =>  {
        const seguindoArray = datas.map((data) => {
          return {
            title: data.login,
            avatarUrl: data.avatar_url,
            id: data.id
          }
        // console.log(datas)
        })
        setSeguindo(seguindoArray)
      }) 
    }   
        

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
    // console.log(comunidadesDoDato)
    setComunidades(comunidadesDoDato);
    
  }) 

  fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      'Authorization': 'a6c5476ab12b0f325735925e5e12d8',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      "query": `query{
        allMessages{
          id
          name
          mensagem          
        }
      }` })
  })
    .then((resposta) => resposta.json())
    .then((respostaCompletaMensagem) => {
      const mensagemDoDato = respostaCompletaMensagem.data.allMessages;
      // console.log(postVindosDoDato);
      setMensagens(mensagemDoDato);
    })
}, [])


  return (
    <>
      <AlurakutMenu githubUser={githubUser}/>
      <MainGrid>
        <div className="profileArea" style={{gridArea: 'profileArea'}}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
            <Box >
              <h1 className="title">
                Bem vindo(a), {githubUser}!
              </h1>
              <OrkutNostalgicIconSet />
              </Box>
               <Box>
                  <h2 className="subTitle"> Deseja adicionar uma comunidade? </h2>
                  <form onSubmit={function handleSubmit(e){
                      e.preventDefault();
                      const dadosDoForm = new FormData(e.target);
                    
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
                        // const comunidade = dados.registroCriado;
                        const comunidadesAtualizadas = [...comunidades, dados.comunidade];
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
                <Box>
                <h2 className="subTitle">Deixe sua mensagem </h2>
               
                <form onSubmit={function handleSubmit(e){
                  e.preventDefault();
                  const dadosDoForm = new FormData(e.target);

                  const mensagem = {

                    name: dadosDoForm.get('name'),
                    mensagem: dadosDoForm.get('mensagem'),
                  }
                  fetch('/api/mensagens', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(mensagem),
                  })
                  .then(async (response) => {
                    const dados = await response.json();
                      
                      //mensagem = dados.registroCriado;
                      const mensagensAtualizadas = [...mensagens, dados.registroCriado]
                      setMensagens(mensagensAtualizadas);
                  })
                }}>
                  <div>
                      <input
                        placeholder="Insira seu usuário do Github" name="name" aria-label="Insira seu usuário do Github" type="text" 
                      />
                  </div>
                  <div>
                      <input
                        placeholder="Deixe uma mensagem sobre esse projeto" name="mensagem" aria-label="Deixe uma mensagem" type="text" 
                      />
                  </div>
                  
                  <button>
                      Criar mensagem
                  </button>
                </form>
          </Box>

          <DepBox>
            <h2 className="smallTitle"> Mensagem ({mensagens.length})</h2>

            <ul>
              {mensagens.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`https://github.com/${itemAtual.name}`}>
                      <img src={`https://github.com/${itemAtual.name}.png`} alt="Foto usuário" />
                    </a>
                    <div style={{ flexGrow: '2' }}>
                      <span>@{itemAtual.name}</span>
                      <p>{itemAtual.mensagem}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </DepBox> 
           
        </div>
        
        <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>

            <ProfileRelationsBox title="Seguidores" items={seguidores} />   

            <ProfileRelationsBox title="Seguindo" items={seguindo} />

            
            <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
                Comunidades ({comunidades.length})
              </h2>
              <ul>
                  {comunidades.slice(0,6).map((itemAtual) => {
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

