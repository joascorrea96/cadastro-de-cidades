import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'


const headerProps = {
    icon: 'fa fa-bar-chart',
    title: 'Relatórios de Cidades',
    subtitle: 'Quantidade de cidades por região e UF!'
}

const baseUrl = 'http://localhost:3001/cities'
const initialState = {
    city: { 
        ibge: '', uf: '', nome_cidade: '', 
        longitude: '', latitude: '', regiao: '' 
    },
    list: []
}

export default class Report extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    getCities(field) {
        const list = this.state.list
        let alreadyChecked = []
        let amountCities = 0
        let cityValues = {}
    
        function getAmount(value, key) {
            amountCities = 0
            for(let i = 0; i < list.length; i++) {
                if(value == list[i][key]){
                    amountCities++
                } 
            }
    
            return amountCities
        }
    
        list.forEach(e => {
            if(alreadyChecked.indexOf(e[`${field}`]) === -1) {
                cityValues[`${e[`${field}`]}`] = getAmount(e[`${field}`], field)
            }
            alreadyChecked.push(e[`${field}`])
        })
    
        return cityValues
    }


    renderTable() {
        return (
            <table className="table mt-4">
                <thead className="thead-dark">
                    <tr className="d-flex">
                        <th className="col-4">Região</th>
                        <th className="col-2">Qtd</th>
                        <th className="col-4">UF</th>
                        <th className="col-2">Qtd</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()} 
                </tbody>
            </table>
        )
    }



    renderRows() {
        return Object.keys(this.getCities('regiao')).map((region, i) => {
            return (
                <tr className="d-flex">
                    <td className="col-4">{region} </td>
                    <td className="col-2">{this.getCities('regiao')[region]}</td>
                    <td className="col-4">{Object.keys(this.getCities('uf'))[i]} </td>
                    <td className="col-2">{Object.values(this.getCities('uf'))[i]}</td>
                </tr>
            )
            
        })
    }


    render() {
        return (
            <Main {...headerProps}>
                {this.renderTable()}
            </Main>
        )
    }
}