import React from 'react'

const RadioButtonAdress = (props: any) => {
    const { endereco, alterarEnderecoPadrao } = props;
    return (
        <div key={endereco.id} className='flex justify-start'>
            <input name='rdEnderecoPadrao' type="radio" onChange={alterarEnderecoPadrao} value={endereco.id} />
            <span className='ml-2'>{endereco.logradouro}</span>
            <span>, {endereco.numero}</span>
            <span>, {endereco.bairro}</span>
            <span>, {endereco.localidade}</span>
        </div>
    )
}

export default RadioButtonAdress