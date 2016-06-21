/**
 * Created by arikyudin on 21/06/16.
 */

(function () {
    'use strict';

    angular.module('Simulator.components')
        .component('exam', {
            bindings: {
                questions: '=',
                timeframe: '<'
            },
            controller: examCtrl,
            template: [
              ' <div class="row">                                                                                                                                                ',
              '     <div class="panel question-area" ng-show="$ctrl.questionInDisplay">                                                                                       ',
              '         <div class="panel-body">                                                                                                                                 ',
              '             <exam-question question="$ctrl.questionInDisplay"></exam-question>                                                                                ',
              '         </div>                                                                                                                                                   ',
              '     </div>                                                                                                                                                       ',
              '     <exam-remote remote="$ctrl.questions" class="col-md-2" switch="$ctrl.switchQuestion(question)" prev="$ctrl.move(-1)" next="$ctrl.move(1)"></exam-remote>',
              ' </div>                                                                                                                                                           ',
              ' <exam-timeframe timeframe="$ctrl.timeframe"></exam-timeframe>                                                                                           '
            ].join('').trim()
        });

    function examCtrl() {

        this.questionInDisplay = this.questions[0];
        this.questionInDisplay.active = true;

        this.switchQuestion = (question) => {

            if (!question) {
                return;
            }

            this.questionInDisplay.active = !this.questionInDisplay.active;
            this.questionInDisplay = question;
            this.questionInDisplay.active = !this.questionInDisplay.active;
        };

        this.move = (count) =>{
            this.switchQuestion(_.find(this.questions, {index: this.questionInDisplay.index + count}));
        };

        this.prevBtn = $('#remote-prev');
        this.nextBtn = $('#remote-next');

        $(document).keydown((e)=>{

            e.stopPropagation();
            switch (e.which) {
                case 37:
                    this.prevBtn.click();
                    break;
                case 39:
                    this.nextBtn.click();
                    break;
                default: return;
            }
            e.preventDefault();
        })
    }

})();