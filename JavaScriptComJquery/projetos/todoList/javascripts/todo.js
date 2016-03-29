//IDEM a $(document).ready()
$(function() {
    
    var $lastClicked;

    function onTarefaKeydown(event) {
        
        //a propriedade "which" retorna o código Unicode da tecla usada
        console.log("Código Unicode da tecla usada: ", event.which, String.fromCharCode(event.which));
        
        if (event.which === 13) {//ENTER
            
            var $tarefa = $("#tarefa");
            
            if(!isTheFieldEmpty($tarefa, $("#tarefaHelp"))){
                addTarefa($tarefa.val());
                $tarefa.val("");    
            }
            
        }
        
    }

    // inputField – ID Number for the html text box
    // helpId – ID Number for the child node I want to print a warning in
    function isTheFieldEmpty(input, helpId) {

        var retorno = false;
        
        if (helpId != null && helpId.length > 0) {

            // Remove any warnings that may exist
            helpId.empty();

        }
        
        if (input.val() === "") {
            
            // Add new warning
            helpId.append(document.createTextNode("* Entre com um valor."));
            retorno = true;
            
        }

        // See if the input value contains any text
        return retorno;
        
    }

    function onTarefaDeleteClick() {

        $(this)
            .parent('.tarefa-item')
            .unbind('click')
            .hide('slow', function() {
                $(this).remove();
            });

    }

    function onTarefaItemClick() {

        if (!$(this).is($lastClicked)) {
            
            if ($lastClicked !== undefined) {
                savePendingEdition($lastClicked);
            }

            $lastClicked = $(this);

            var text = $lastClicked.children('.tarefa-texto').text();

            var content = "<input type='text' class='tarefa-edit' value='" +
                text + "'>";

            $lastClicked.html(content);

            $(".tarefa-edit").keydown(onTarefaEditKeydown);
            
        }

    }

    function onTarefaEditKeydown(event) {
        
        if (event.which === 13) {//ENTER
            savePendingEdition($lastClicked);
            $lastClicked = undefined;
        }
        
    }

    function savePendingEdition($tarefa) {
        
        var text = $tarefa.children('.tarefa-edit').val();
        $tarefa.empty();
        $tarefa.append("<div class='tarefa-texto'>" + text + "</div>")
            .append("<div class='tarefa-delete'></div>")
            .append("<div class='clear'></div>");

        $(".tarefa-delete").click(onTarefaDeleteClick);

        $tarefa.click(onTarefaItemClick);
        
    }

    function addTarefa(text) {
        
        var $tarefa = $("<div />")
            .addClass("tarefa-item")
            .append($("<div />")
                .addClass("tarefa-texto")
                .text(text))
            .append($("<div />")
                .addClass("tarefa-delete"))
            .append($("<div />")
                .addClass("clear"));

        $("#tarefa-list").append($tarefa);

        addTarefaDeleteAndTarefaItemEvents();
        
    }

    function addTarefaDeleteAndTarefaItemEvents() {
        
        $(".tarefa-delete").click(onTarefaDeleteClick);

        $(".tarefa-item").click(onTarefaItemClick);
        
    }
    
    //
    //Remover possíveis outras funções (anteriores) que 
    //estejam associadas ao evento "keydown" do item que
    //possui o id "tarefa".    
    //

    /*
    $("#tarefa").keydown(function(event) {
        console.log('Oi!!!');
    });
    
    $("#tarefa").off("keydown");
    */

    //Bind "on" e Unbind "off" com "namespace"
    /*    
    $("#tarefa").on("keydown.primeiro", function() {
        console.log("Esse é o primeiro evento");
    });
    
    $("#tarefa").on("keydown.segundo", function() {
        console.log("Esse é o segundo evento");
    });
    
    $("#tarefa").off("keydown.primeiro");
    */

    //Excluir todos os eventos de #tarefa
    //$("#tarefa").off();

    $("#tarefa").keydown(onTarefaKeydown);

    addTarefaDeleteAndTarefaItemEvents();

});