(function( $, doc ){
  'use strict';

  const app = (function appController(){
    let $public = {};

    const $bodyTable = $('[data-js="bodyTable"]').get();
    const urlAjax = 'http://localhost:3001/car';

    function initEvents() {
      $('[data-js="form-register"]').on( 'submit', handleSubmit  );
    }

    function companyInfo() {
      let ajax = new XMLHttpRequest();
      ajax.open('GET', 'js/company.json', true);
      ajax.send();
      ajax.addEventListener('readystatechange', getCompanyInfo, false);
    }

    function getCompanyInfo() {
      if ( !isReady.call( this ) )
        return;
      const dadosCompany = JSON.parse( this.responseText );
      setCompanyInfo( dadosCompany );
    }

    function setCompanyInfo( dadosCompany ) {
      let $companyName = $('[data-js="company-name"]').get();
      let $companyPhone = $('[data-js="company-phone"]').get();
      $companyName.appendChild( doc.createTextNode( dadosCompany.name ) );
      $companyPhone.appendChild( doc.createTextNode( dadosCompany.phone ) );
    }

    function isReady() {
      return this.readyState === 4 && this.status === 200;
    }

    function handleSubmit(event) {
      event.preventDefault();
      const car = {
        image: $('[data-js="image"]').get().value,
        brandModel: $('[data-js="brand-model"]').get().value,
        plate: $('[data-js="plate"]').get().value,
        year:  $('[data-js="year"]').get().value,
        color: $('[data-js="color"]').get().value
      };
      addCar( car );
    }

    function addCar( car ){
      let ajax = new XMLHttpRequest();
      ajax.open( 'POST', urlAjax );
      ajax.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
      ajax.send( `image=${car.image}&brandModel=${car.brandModel}&year=${car.year}&plate=${car.plate}&color=${car.color}` );

      ajax.onreadystatechange = function(){
        if( !isReady.call( this ) )
          return;
        const data = JSON.parse( ajax.responseText );
        if( data.message === 'success' )
          requestCars();
      };
    }

    function requestCars(){
      let ajax = new XMLHttpRequest();
      ajax.open( 'GET', urlAjax );
      ajax.send();
      ajax.addEventListener( 'readystatechange', hasCars, false );
    };

    function hasCars( ){
      if( !isReady.call( this ) )
        return;
      const cars = JSON.parse( this.responseText );
      atualizarBodyTable( cars );
    };

    function atualizarBodyTable( cars ){
      let $trs = '';
      cars.forEach( car => {
        $trs += `
          <tr>
            <td><img src="${car.image}" class="img-thumbnail car_tamanho"></td>
            <td>${car.brandModel}</td>
            <td data-js="plate">${car.plate}</td>
            <td>${car.year}</td>
            <td>${car.color}</td>
            <td>
              <button data-js="remove" class="btn btn-danger">
                <i class="fa fa-remove"></i> Remover
              </button>
            </td>
        `; 
      });
      $bodyTable.innerHTML = $trs;
      initEventRemove();
    };

    function initEventRemove(){
      $('[data-js="remove"]').on( 'click', handleClickRemove );
    };

    function handleClickRemove( event ){
      event.preventDefault();
      let $trRemove = this.parentElement.parentElement;
      removeCar( $trRemove );
    }

    function getPlate( $tdsCar ){
      let plate;
      Array.from( $tdsCar ).forEach( element => {
        if( element.getAttribute('data-js') === 'plate')
           plate = element.textContent;
      });
      return plate;
    }

    function removeCar( $trRemove ){
      let ajax = new XMLHttpRequest();
      ajax.open( 'DELETE', urlAjax );
      ajax.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
      ajax.send( `plate=${getPlate($trRemove.children)}` );
      $bodyTable.removeChild( $trRemove );
    }

    $public.init = function init(){
      initEvents();
      companyInfo();
      requestCars();
    };

    return $public;
  })();

  app.init();

})( window.DOM, document );
