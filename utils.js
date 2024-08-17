function getPrice(order) {
    let total = 0
    order.amounts?.forEach(add => {
        let price = add.product.price
        add?.additional?.forEach(select => {
            price += select.price
        })
        price *= add.quantity
        total += price
    })
    return total
}

function getProductPage(amounts) {
    let products = ''

    amounts?.forEach((amount) => {
        let total = amount.product.price
        let additionals = ''

        amount.additional?.forEach(additional => {
            total += additional.price
            additionals += ' ' + additional.name + '\n'
        })

        let product = `x${amount.quantity} ${amount.product.name} ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`
        product += additionals

         if(amount.observation && amount.observation != ''){
            product += `obs: ${amount.observation}\n`
        }
        
        products += product
    })

    return products
}

function generateOrderToText(order) {
    let date = new Date(order?.dateCreation)

    const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: true }).slice(0, 5);
    let page =
        `
# Pizzaria Sapucaian's
Hora: 
${formattedDate} - ${formattedTime}
ID do pedido: ${order.id}
Nome do cliente: ${order.name}
___
Telefone: ${order.cellPhone}
Endereço: ${order.address}
___
Produtos:
${getProductPage(order.amounts)}
Forma de pagamaento: ${order.payment}
___
Total:
${getPrice(order).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
`
return page
}

export {generateOrderToText}