// Importa as APIs necessárias do Vendetta.
// 'vendetta' fornece acesso aos finders e outras utilidades centrais.
// 'patcher' é usado para modificar funções existentes (não usado neste plugin, mas é um import comum).
import { vendetta } from "@vendetta";
import { findByProps } from "@vendetta/metro";
import { findByStoreName } from "@vendetta/metro";

// Armazena a função de "unpatch" para ser chamada no onUnload.
// Neste caso, armazena o resultado do registro do comando para poder desregistrá-lo.
let unpatch;

export default {
    // onLoad é executado quando o plugin é ativado.
    onLoad: () => {
        // 1. Localizar os módulos internos do Discord necessários.

        // Módulo para registrar/desregistrar comandos de barra.
        const commands = findByProps("register", "unregister");
        
        // Módulo para enviar mensagens.
        const sendMessageModule = findByProps("sendMessage", "receiveMessage");

        // Store que contém informações sobre o estado dos canais, incluindo o canal atual.
        const channelStore = findByStoreName("ChannelStore");

        // 2. Registrar o comando slash.
        // A função 'register' retorna uma função para desregistrar o comando, que armazenamos em 'unpatch'.
        unpatch = commands.register({
            // O nome técnico do comando.
            name: "jjs",
            // O nome exibido para o usuário.
            displayName: "jjs",
            // A descrição que aparece na interface do Discord.
            description: "Envia 'UM!' e depois 'DOIS!' no chat.",
            // ID da aplicação. "-1" indica que é um comando local do cliente.
            applicationId: "-1",
            // Tipo de comando. 1 é o padrão para comandos de chat.
            type: 1,
            // Onde o comando pode ser usado. 1 permite o uso em canais de texto.
            inputType: 1,
            
            // A função que será executada quando o comando for usado.
            // 'args' conteria os argumentos do comando, e 'ctx' o contexto (como o canal).
            execute: (args, ctx) => {
                // 3. Implementar a lógica de envio de mensagens.

                // Obter o ID do canal atual a partir do contexto do comando.
                const channelId = ctx.channel.id;

                // Enviar a primeira mensagem.
                // O segundo argumento 'true' indica que é uma mensagem de texto simples.
                sendMessageModule.sendMessage(channelId, {
                    content: "UM!"
                }, true);

                // Usar setTimeout para criar um atraso antes de enviar a segunda mensagem.
                // Um atraso de 750ms simula uma pausa mais natural.
                setTimeout(() => {
                    // Enviar a segunda mensagem.
                    sendMessageModule.sendMessage(channelId, {
                        content: "DOIS!"
                    }, true);
                }, 750); // Atraso em milissegundos.
            }
        });
    },

    // onUnload é executado quando o plugin é desativado.
    onUnload: () => {
        // Chama a função retornada por 'commands.register' para limpar o comando.
        // Isso garante que o comando /jjs seja removido da interface do Discord.
        unpatch?.();
    }
};
