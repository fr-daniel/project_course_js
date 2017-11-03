(function ($, doc) {
  'use strict';

  var app = (function appController() {
    return {
      init: function () {
        console.log('app init');
        this.companyInfo();
        this.initEvents();
        this.requestCars();
      },

      initEvents: function initEvents() {
        $('[data-js="form-register"]').on( 'submit', this.handleSubmit);
      },

      initEventRemove: function initEventRemove(){
        $('[data-js="remove"]').on( 'click', this.handleClickRemove );
      },

      companyInfo: function companyInfo() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'js/company.json', true);
        ajax.send();
        ajax.addEventListener('readystatechange', this.getCompanyInfo, false);
      },

      getCompanyInfo: function getCompanyInfo() {
        if (!app.isReady.call(this))
          return;

        var data = JSON.parse(this.responseText);
        app.setCompanyInfo.call(data);
      },

      setCompanyInfo: function setCompanyInfo() {
        var $companyName = $('[data-js="company-name"]').get();
        var $companyPhone = $('[data-js="company-phone"]').get();
        var $companyNameTitle = $('[data-js="companyNameTitle"]').get();

        $companyName.appendChild(doc.createTextNode(this.name));
        $companyPhone.appendChild(doc.createTextNode(this.phone));
        $companyNameTitle.textContent = this.name;
      },

      isReady: function isReady() {
        return this.readyState === 4 && this.status === 200;
      },

      handleSubmit: function handleSubmit(event) {
        event.preventDefault();
        var car =
          {
          image: $('[data-js="image"]').get().value,
          brandModel: $('[data-js="brand-model"]').get().value,
          plate: $('[data-js="plate"]').get().value,
          year:  $('[data-js="year"]').get().value,
          color: $('[data-js="color"]').get().value
          };
        app.addCarServer( car );
      },

      addCarServer: function addCarServer( car ){
        var ajax = new XMLHttpRequest();
        ajax.open( 'POST', 'http://localhost:3000/car' );
        ajax.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
        ajax.send( 
          'image=' + car.image 
          + '&brandModel=' + car.brandModel 
          + '&year=' + car.year
          + '&plate=' + car.plate
          + '&color=' + car.color
         );

        ajax.onreadystatechange = function(){
          if( !app.isReady.call( this ) )
            return;
          var data = JSON.parse( ajax.responseText );
          if( data.message === 'success' )
            app.addCarTable.call( app, car );
        };
      },

      requestCars: function initCars(){
        var ajax = new XMLHttpRequest();
        ajax.open( 'GET', 'http://localhost:3000/car' );
        ajax.send();
        ajax.addEventListener( 'readystatechange', this.getCars, false );
      },

      getCars: function getCars( e ){
        if( !app.isReady.call( this ) )
          return;
        var cars = JSON.parse( this.responseText );
        app.addCarTable.apply( app, cars );
      },

      addCarTable: function addCarTable(){
        var $trs = '';
        Array.prototype.forEach.call( arguments, function( car ) {
          $trs += '<tr>'
                    + '<td><img src="' + car.image + '" class="img-thumbnail car_tamanho"></td>'
                    + '<td>' + car.brandModel + '</td>'
                    + '<td>' + car.plate + '</td>'
                    + '<td>' + car.year + '</td>'
                    + '<td>' + car.color + '</td>'
                    + '<td><button data-js="remove" class="btn btn-danger"><i class="fa fa-remove"></i> Remover</Button></td>'
                    + '</tr>';
        });
        var $bodyTable = $('[data-js="bodyTable"]').get();
        $bodyTable.insertAdjacentHTML('beforeend', $trs );
        this.initEventRemove();
      },

      handleClickRemove: function handleClickRemove( event ){
        event.preventDefault();
        var $trRemove = this.parentElement.parentElement;
        var $bodyTable = $('[data-js="bodyTable"]').get();
        $bodyTable.removeChild($trRemove);
      }
    };

  })();

  app.init();

})(window.DOM, document);
