const {select, input, checkbox} = require ('@inquirer/prompts') 

const fs = require("fs").promises


let mensagem = "Bem vindo ao app de metas"

let metas

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }catch(erro){
        metas = []
    }
    
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2)) 
}



const cadastrarMeta = async () => {
    const meta = await input ({message: "Digite a meta:"})

    if(meta.length==0){
        mensagem: "Meta não pode ser vazia."
        return

    }

    metas.push({
        value: meta, checked: false
    })

}

const listarMetas = async () => {

    if(metas.length == 0){
        mensagem: "Não existem metas!"
        return
    }

    const respostas = await checkbox({
        message: "Use as setas para mudar de meta. O espaço para marcar ou desmarcar. Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((m)=>{
        m.checked = false
    })

    if(respostas.length==0){
        mensagem: "Nenhuma meta selecionada"
        return
    }

    respostas.forEach((resposta)=>{
        const meta = metas.find((m)=>{
            return m.value == resposta
        })
        meta.checked = true 
    })

    mensagem: 'Meta(s) marcada(s) como concluida(s)'
}

const metasRealizadas = async () => {

    if(metas.length == 0){
        mensagem: "Não existem metas!"
        return
    }
    const realizadas = metas.filter((meta)=>{
        return meta.checked
    })
    if(realizadas.length==0){
        mensagem: 'Não existem metas realizadas :('
        return 
    }

    await select({
        message: "Metas realizadas " + realizadas.length,
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {

    if(metas.length == 0){
        mensagem: "Não existem metas!"
        return
    }
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if(abertas.length == 0){
        mensagem: "Não existem metas abertas :)"
        return
    }

    await select({
        message: "Metas abertas " + abertas.length,
        choices: [...abertas]
    })
}

const deletarMetas = async () => {

    if(metas.length == 0){
        mensagem: "Não existem metas!"
        return
    }
    
    const metasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked: false}
    })
    
    const itensADeletar = await checkbox({
        message: "Selecione para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if(itensADeletar.length == 0){
        mensagem: "Nenhum item a deletar!"
        return
    }

    itensADeletar.forEach((item) => {
        metas = metas.filter ((meta) => {
            return meta.value != item
        })
    })

    mensagem: "Meta(s) deletada(s) com sucesso!"
}

const mostrarMensagem = () => {
    console.clear();

    if(mensagem !=""){
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async() => {

    await carregarMetas() 

    while(true){

        mostrarMensagem()
        await salvarMetas()

        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastra meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar meta",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Deletar metas",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]

        })

        switch(opcao){
            case "cadastrar":
                await cadastrarMeta()
                //console.log("Vamos cadastrar")
                break
            case "listar":
                await listarMetas() 
                //console.log("Vamos listar")
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "deletar":
                await deletarMetas()
                break
            case "sair":
                console.log("Até logo")
                return
            }


    }
    
 }

 start()