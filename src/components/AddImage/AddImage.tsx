import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const AddImage = (props: any) => {
    const { callBack, product } = props;
    const [images, setImages] = useState<any[]>([]);

    const convertToBase64 = (e: any) => {
        const file = e.target.files[0];
        images.push(file);
        setImages(images);
    }
    const adicionaFoto = () => {
        images.forEach(async function (item: any) {
            try {
                let data = { file: item }
                await axios.post(`https://jersey-market-api-production.up.railway.app/product/img/id${product.id}/upload`, data, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                callBack();

            } catch (e) {
                toast.error('Houve um erro inesperado, tente novamente!', {
                    position: toast.POSITION.TOP_RIGHT,
                });
                console.log(e);
            }
        })
    }
    return (
        <div className='flex flex-col justify-between items-center w-96 h-48 ml-4 pt-16'>
            <input type='file' onChange={convertToBase64} />
            <div className='mb-4'>
                <button className='py-1 px-10 border rounded-md bg-green-500 text-white' onClick={adicionaFoto}>Adicionar</button>
            </div>
        </div>
    )
}

export default AddImage