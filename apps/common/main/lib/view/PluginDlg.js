/*
 *
 * (c) Copyright Ascensio System SIA 2010-2022
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
*/
/**
 * User: Julia.Radzhabova
 * Date: 17.05.16
 * Time: 15:38
 */

if (Common === undefined)
    var Common = {};

Common.Views = Common.Views || {};

define([
    'common/main/lib/util/utils',
    'common/main/lib/component/BaseView',
    'common/main/lib/component/Layout',
    'common/main/lib/component/Window'
], function (template) {
    'use strict';

    Common.Views.PluginDlg = Common.UI.Window.extend(_.extend({
        initialize : function(options) {
            var _options = {};
            _.extend(_options,  {
                header: true,
                enableKeyEvents: false
            }, options);

            var header_footer = (_options.buttons && _.size(_options.buttons)>0) ? 85 : 34;
            if (!_options.header) header_footer -= 34;
            this.bordersOffset = 40;
            _options.width = (Common.Utils.innerWidth()-this.bordersOffset*2-_options.width)<0 ? Common.Utils.innerWidth()-this.bordersOffset*2: _options.width;
            _options.height += header_footer;
            _options.height = (Common.Utils.innerHeight()-this.bordersOffset*2-_options.height)<0 ? Common.Utils.innerHeight()-this.bordersOffset*2: _options.height;
            _options.cls += ' advanced-settings-dlg';

            this.template = [
                '<div id="id-plugin-container" class="box" style="height:' + (_options.height-header_footer) + 'px;">',
                '<div id="id-plugin-placeholder" style="width: 100%;height: 100%;"></div>',
                '</div>',
                '<% if ((typeof buttons !== "undefined") && _.size(buttons) > 0) { %>',
                '<div class="separator horizontal"></div>',
                '<% } %>'
            ].join('');

            _options.tpl = _.template(this.template)(_options);

            this.url = options.url || '';
            this.frameId = options.frameId || 'plugin_iframe';
            Common.UI.Window.prototype.initialize.call(this, _options);
        },

        render: function() {
            Common.UI.Window.prototype.render.call(this);
            this.$window.find('> .body').css({height: 'auto', overflow: 'hidden'});

            this.boxEl = this.$window.find('.body > .box');
            this._headerFooterHeight = (this.options.buttons && _.size(this.options.buttons)>0) ? 85 : 34;
            if (!this.options.header) this._headerFooterHeight -= 34;
            this._headerFooterHeight += ((parseInt(this.$window.css('border-top-width')) + parseInt(this.$window.css('border-bottom-width'))));

            var iframe = document.createElement("iframe");
            iframe.id           = this.frameId;
            iframe.name         = 'pluginFrameEditor';
            iframe.width        = '100%';
            iframe.height       = '100%';
            iframe.align        = "top";
            iframe.frameBorder  = 0;
            iframe.scrolling    = "no";
            iframe.allow = "camera; microphone; display-capture";
            iframe.onload       = _.bind(this._onLoad,this);

            var me = this;
            setTimeout(function(){
                if (me.isLoaded) return;
                me.loadMask = new Common.UI.LoadMask({owner: $('#id-plugin-placeholder')});
                me.loadMask.setTitle(me.textLoading);
                me.loadMask.show();
                if (me.isLoaded) me.loadMask.hide();
            }, 500);

            iframe.src = this.url;
            $('#id-plugin-placeholder').append(iframe);

            this.on('resizing', function(args){
                me.boxEl.css('height', parseInt(me.$window.css('height')) - me._headerFooterHeight);
            });

            var onMainWindowResize = function(){
                me.onWindowResize();
            };
            $(window).on('resize', onMainWindowResize);
            this.on('close', function() {
                $(window).off('resize', onMainWindowResize);
            });
        },

        _onLoad: function() {
            this.isLoaded = true;
            if (this.loadMask)
                this.loadMask.hide();
        },

        setInnerSize: function(width, height) {
            var maxHeight = Common.Utils.innerHeight(),
                maxWidth = Common.Utils.innerWidth(),
                borders_width = (parseInt(this.$window.css('border-left-width')) + parseInt(this.$window.css('border-right-width'))),
                bordersOffset = this.bordersOffset*2;
            if (maxHeight - bordersOffset<height + this._headerFooterHeight)
                height = maxHeight - bordersOffset - this._headerFooterHeight;
            if (maxWidth - bordersOffset<width + borders_width)
                width = maxWidth - bordersOffset - borders_width;

            this.boxEl.css('height', height);

            Common.UI.Window.prototype.setHeight.call(this, height + this._headerFooterHeight);
            Common.UI.Window.prototype.setWidth.call(this, width + borders_width);

            this.$window.css('left',(maxWidth - width - borders_width) / 2);
            this.$window.css('top',(maxHeight - height - this._headerFooterHeight) / 2);
        },

        onWindowResize: function() {
            var main_width  = Common.Utils.innerWidth(),
                main_height = Common.Utils.innerHeight(),
                win_width = this.getWidth(),
                win_height = this.getHeight(),
                bordersOffset = (this.resizable) ? 0 : this.bordersOffset;
            if (win_height<main_height-bordersOffset*2+0.1 && win_width<main_width-bordersOffset*2+0.1) {
                var left = this.getLeft(),
                    top = this.getTop();

                if (top<bordersOffset) this.$window.css('top', bordersOffset);
                else if (top+win_height>main_height-bordersOffset)
                    this.$window.css('top', main_height-bordersOffset - win_height);
                if (left<bordersOffset) this.$window.css('left', bordersOffset);
                else if (left+win_width>main_width-bordersOffset)
                    this.$window.css('left', main_width-bordersOffset-win_width);
            } else {
                if (win_height>main_height-bordersOffset*2) {
                    this.setHeight(Math.max(main_height-bordersOffset*2, this.initConfig.minheight));
                    this.boxEl.css('height', Math.max(main_height-bordersOffset*2, this.initConfig.minheight) - this._headerFooterHeight);
                    this.$window.css('top', bordersOffset);
                }
                if (win_width>main_width-bordersOffset*2) {
                    this.setWidth(Math.max(main_width-bordersOffset*2, this.initConfig.minwidth));
                    this.$window.css('left', bordersOffset);
                }
            }
        },

        textLoading : 'Loading'
    }, Common.Views.PluginDlg || {}));
});