(function( $, doc ){
  'use strict';

  var app = (function appController(){
    var $public = {};

    var $bodyTable = $('[data-js="bodyTable"]').get();
    var urlAjax = 'http://localhost:3001/car';

    function initEvents() {
      $('[data-js="form-register"]').on( 'submit', handleSubmit  );
    }

    function companyInfo() {
      var ajax = new XMLHttpRequest();
      ajax.open('GET', 'js/company.json', true);
      ajax.send();
      ajax.addEventListener('readystatechange', getCompanyInfo, false);
    }

    function getCompanyInfo() {
      if ( !isReady.call( this ) )
        return;
      var dadosCompany = JSON.parse( this.responseText );
      setCompanyInfo( dadosCompany );
    }

    function setCompanyInfo( dadosCompany ) {
      var $companyName = $('[data-js="company-name"]').get();
      var $companyPhone = $('[data-js="company-phone"]').get();
      $companyName.appendChild( doc.createTextNode( dadosCompany.name ) );
      $companyPhone.appendChild( doc.createTextNode( dadosCompany.phone ) );
    }

    function isReady() {
      return this.readyState === 4 && this.status === 200;
    }

    function handleSubmit(event) {
      event.preventDefault();
      var car = {
        image: $('[data-js="image"]').get().value,
        brandModel: $('[data-js="brand-model"]').get().value,
        plate: $('[data-js="plate"]').get().value,
        year:  $('[data-js="year"]').get().value,
        color: $('[data-js="color"]').get().value
      };
      addCarServer( car );
    }

    function addCarServer( car ){
      var ajax = new XMLHttpRequest();
      ajax.open( 'POST', urlAjax );
      ajax.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
      ajax.send( 
        'image=' + car.image 
        + '&brandModel=' + car.brandModel 
        + '&year=' + car.year
        + '&plate=' + car.plate
        + '&color=' + car.color
       );

      ajax.onreadystatechange = function(){
        if( !isReady.call( this ) )
          return;
        var data = JSON.parse( ajax.responseText );
        if( data.message === 'success' )
          requestCars();
      };
    }

    function requestCars(){
      var ajax = new XMLHttpRequest();
      ajax.open( 'GET', urlAjax );
      ajax.send();
      ajax.addEventListener( 'readystatechange', hasCars, false );
    };

    function hasCars( ){
      if( !isReady.call( this ) )
        return;
      var cars = JSON.parse( this.responseText );
      atualizarBodyTable.apply( atualizarBodyTable, cars );
    };

    function atualizarBodyTable(){
      var $trs = '';
      Array.prototype.forEach.call( arguments, function( car ) {
        $trs += '<tr>'
                  + '<td><img src="' + car.image + '" class="img-thumbnail car_tamanho"></td>'
                  + '<td>' + car.brandModel + '</td>'
                  + '<td data-js="plate">' + car.plate + '</td>'
                  + '<td>' + car.year + '</td>'
                  + '<td>' + car.color + '</td>'
                  + '<td><button data-js="remove" class="btn btn-danger"><i class="fa fa-remove"></i> Remover</Button></td>'
                  + '</tr>';
      });
      $bodyTable.innerHTML = $trs;
      initEventRemove();
    };

    function initEventRemove(){
      $('[data-js="remove"]').on( 'click', handleClickRemove );
    };

    function handleClickRemove( event ){
      event.preventDefault();
      var $trRemove = this.parentElement.parentElement;
      removeCarSever( getPlate( $trRemove) );
      $bodyTable.removeChild( $trRemove );
    }

    function getPlate( $trCar ){
      var plate;
      Array.prototype.forEach.call( $trCar.children, function( element ){
        if( element.getAttribute('data-js') === 'plate')
           plate =  element.textContent;
      });
      return plate;
    }

    function removeCarSever( plate ){s
      var ajax = new XMLHttpRequest();
      ajax.open( 'DELETE', urlAjax );
      ajax.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
      ajax.send( 'plate=' + plate );
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
