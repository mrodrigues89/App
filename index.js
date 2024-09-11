const {select, input, checkbox} = require ('@inquirer/prompts') 

let meta = {
    value: 'Tomar 3L de água por dia',
    checked: false,
}

let metas = [meta]

const cadastrarMeta = async () => {
    const meta = await input ({message: "Digite a meta:"})

    if(meta.length==0){
        console.log("Meta não pode ser vazia.")
        return

    }

    metas.push({
        value: meta, checked: false
    })

}

const listarMetas = async () => {
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta. O espaço para marcar ou desmarcar. Enter para finalizar essa etapa",
        choices:[...metas],
        instructions: false
    })

    if(respostas.length==0){
        console.log("Nenhuma meta selecionada")
        return
    }

    metas.forEach((m)=>{
        m.checked = false
    })

    respostas.forEach((resposta)=>{
        const meta = metas.find((m)=>{
            return m.value == resposta
        })
        meta.checked = true 
    })

    console.log ('Meta(s) marcada(s) como concluida(s)')
}

const start = async() => {

    while(true){

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
                    name: "Sair",
                    value: "sair"
                }
            ]

        })

        switch(opcao){
            case "cadastrar":
                await cadastrarMeta()
                console.log(metas)
                //console.log("Vamos cadastrar")
                break
            case "listar":
                await listarMetas() 
                //console.log("Vamos listar")
                break
            case "sair":
                console.log("Até logo")
                return
            }


    }
    
 }

 start()