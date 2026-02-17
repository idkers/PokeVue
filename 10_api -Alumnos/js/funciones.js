const inst = Vue.createApp({
    created(){
       this.cargarPokemones();
       this.pokemonesFiltrados=this.pokemones;
    },
    data(){
        return{
            fondo:false,
            pokemones:[],
            pokemonesFiltrados:[],
            tipoSeleccionado:'Todos',
            mostrarModal: false,
            pokemonSeleccionado: null
        }
    },
   methods:{
   cargarPokemones(){
    axios.get("https://pokeapi.co/api/v2/pokemon?limit=151").then(respuesta =>{
      const requests = respuesta.data.results.map(pokemon => axios.get(pokemon.url));
      
      Promise.all(requests).then(responses => {
        this.pokemones = responses.map(res => {
          const data = res.data;
          return {
            id: data.id,
            name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            image: data.sprites.other['official-artwork'].front_default,
            height: (data.height / 10).toFixed(1),
            weight: (data.weight / 10).toFixed(1),
            types: data.types.map(t => t.type.name),
            abilities: data.abilities.map(a => a.ability.name),
            stats: {
              hp: data.stats[0].base_stat,
              attack: data.stats[1].base_stat,
              defense: data.stats[2].base_stat,
              speed: data.stats[5].base_stat
            }
          };
        });
        console.log(this.pokemones);
        this.pokemonesFiltrados = this.pokemones;
      });
    });
    },
   
   filtrarPorTipo(tipo){
        this.tipoSeleccionado = tipo;
        if(this.tipoSeleccionado === 'Todos'){
            this.pokemonesFiltrados = this.pokemones;
        } else {
            this.pokemonesFiltrados = this.pokemones.filter(pokemon => 
                pokemon.types.includes(tipo)
            );
        }
    },
    
    verDetalle(pokemon){
        this.pokemonSeleccionado = pokemon;
        this.mostrarModal = true;
    },
    
    cerrarModal(){
        this.mostrarModal = false;
        this.pokemonSeleccionado = null;
    }
   },
   computed:{

        cantidadTipoActual(){
            if(this.tipoSeleccionado === 'Todos') return this.pokemones.length;
            return this.pokemones.filter(p => p.types.includes(this.tipoSeleccionado)).length;
        },

        porcentajeTipoActual(){
            if(this.pokemones.length === 0) return 0;
            return parseFloat(((this.cantidadTipoActual / this.pokemones.length) * 100).toFixed(1));
        },

        etiquetaProgreso(){
            if(this.tipoSeleccionado === 'Todos'){
                return `${this.pokemones.length} / ${this.pokemones.length} Pokémon (100%)`;
            }
            return `Tipo ${this.tipoSeleccionado}: ${this.cantidadTipoActual} / ${this.pokemones.length} Pokémon (${this.porcentajeTipoActual}%)`;
        },

        colorBarra(){
            const colores = {
                'Todos':    '#6c757d',
                'fire':     '#F08030',
                'water':    '#6890F0',
                'grass':    '#78C850',
                'electric': '#F8D030',
                'psychic':  '#F85888'
            };
            return colores[this.tipoSeleccionado] || '#6c757d';
        }
    }
});

const app = inst.mount("#contenedor");
