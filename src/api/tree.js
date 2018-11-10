/*
     *函数定义
     *入口参数data,平行数组
     *key，id字段
     *parentKey，父字段
     *map,需要将原始属性名称转换为什么名称
     */
export function TreeUtil(data, key, parentKey, map) {
    this.data = data;
    this.key = key;
    this.parentKey = parentKey;
    this.treeKey = key; //key要转换成什么属性名称
    this.map = map;
    if (map) {
        if (map[key]) this.treeKey = map[key];
    }
    this.pos = {};
    this.tree = [];
    this.toTree = function () {
        var data = this.data;
        var i = 0;
        while (data.length != 0) {
            if (data[i][this.parentKey] == 0) {
                var _temp = this.copy(data[i]);
                this.tree.push(_temp);
                this.pos[data[i][this.key]] = [this.tree.length - 1];
                data.splice(i, 1);
                i--;
            } else {
                var posArr = this.pos[data[i][this.parentKey]];
                if (posArr != undefined) {
                    var obj = this.tree[posArr[0]];
                    for (var j = 1; j < posArr.length; j++) {
                        obj = obj.children[posArr[j]];
                    }
                    var _temp = this.copy(data[i]);
                    if(!obj.children){
                        obj.children=[];
                    }
                    obj.children.push(_temp);
                    this.pos[data[i][this.key]] = posArr.concat([obj.children.length - 1]);
                    data.splice(i, 1);
                    i--;
                }
            }
            i++;
            if (i > data.length - 1) {
                i = 0;
            }
        }
        return this.tree;
    };
    this.copy = function (item) {
        var _temp = {};
        _temp[this.treeKey] = item[this.key];
        for (var _index in item) {
            if (_index != this.key && _index != this.parentKey) {
                var _property = item[_index];
                if ((!!this.map) && this.map[_index])
                    _temp[this.map[_index]] = _property;
                else
                    _temp[_index] = _property;
            }
        }
        return _temp;
    };

    this.getNode=function(id){
        var posArr = this.pos[id];
        var obj = this.tree[posArr[0]];
        for (var j = 1; j < posArr.length; j++) {
            obj = obj.children[posArr[j]];
        }
        return obj;
    }

    this.getTree=function(){
        return this.tree;
    }
    this.toTree();
}

