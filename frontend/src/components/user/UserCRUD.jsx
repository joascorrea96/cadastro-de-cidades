import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'


const headerProps = {
    icon: 'users',
    title: 'Cidades',
    subtitle: 'Cadastro de cidades: Incluir, Listar, Alterar e Excluir!'
}

const baseUrl = 'http://localhost:3001/cities'
const initialState = {
    city: { 
        ibge: '', uf: '', nome_cidade: '', 
        longitude: '', latitude: '', regiao: '' 
    },
    list: []
}

export default class UserCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({ city: initialState.city })
    }
    
    save() {
        const city = this.state.city
        const method = city.id ? 'put' : 'post'
        const url = city.id ? `${baseUrl}/${city.id}` : baseUrl
        
        let validation = false
        this.state.list.forEach(e => {
            if(e.ibge == city.ibge || (e.nome_cidade == city.nome_cidade &&
                e.uf == city.uf)) validation = true
            })
            
            
        if(Object.values(city).indexOf("") !== -1 || validation) {
            document.getElementById('msg').innerHTML = "Erro! Campo vazio ou cidade já existente."
        } else {
            axios[method](url, city)
                .then(resp => {
                    document.getElementById('msg').innerHTML = "Cidade cadastrada com sucesso!"
                    const list = this.getUpdatedList(resp.data)
                    this.setState({ city: initialState.city, list })
                })
        }
    }

    getUpdatedList(city, add = true) {
        const list = this.state.list.filter(c => c.id !== city.id)
        if(add) list.unshift(city)
        return list
    }

    updateField(event) {
        const city = { ...this.state.city }
        city[event.target.name] = event.target.value
        this.setState({ city })
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome da cidade</label>
                            <input type="text" className="form-control"
                                name="nome_cidade"
                                value={this.state.city.nome_cidade}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome da cidade..."/>
                            <br/>

                            <label>UF</label>
                            <input type="text" className="form-control"
                                name="uf"
                                value={this.state.city.uf}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o UF..."/>
                            <br/>

                            <label>Região</label>
                            <input type="text" className="form-control"
                                name="regiao"
                                value={this.state.city.regiao}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a região..."/>
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>IBGE</label>
                            <input type="number" className="form-control"
                                name="ibge"
                                value={this.state.city.ibge}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o IBGE..."/>
                            <br/>

                            <label>Longitude</label>
                            <input type="number" className="form-control"
                                name="longitude"
                                value={this.state.city.longitude}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a longitude..."/>
                            <br/>

                            <label>Latitude</label>
                            <input  type="number" className="form-control"
                                name="latitude"
                                value={this.state.city.latitude}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a latitude..."/>
                            <br/>
                        </div>
                    </div>
                </div>

                <hr/>
                <div className="row">
                    <span id="msg" className="col-4 d-flex justify-content-start"></span>
                    <div className="col-8 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(city) {
        this.setState({ city })
    }

    remove(city) {
        axios.delete(`${baseUrl}/${city.id}`).then(resp => {
            const list = this.getUpdatedList(city, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>UF</th>
                        <th>Região</th>
                        <th>IBGE</th>
                        <th>Longitude</th>
                        <th>Latitude</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(city => {
            return (
                <tr style={{fontSize: "12px"}} key={city.id}>
                    <td>{city.nome_cidade}</td>
                    <td>{city.uf}</td>
                    <td>{city.regiao}</td>
                    <td>{city.ibge}</td>
                    <td>{city.longitude}</td>
                    <td>{city.latitude}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(city)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(city)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }


    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}