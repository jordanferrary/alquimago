import test from 'node:test';
import assert from 'node:assert/strict';
import {imageMetrics,imageMetricAdvice} from '../src/image-insight.mjs';
test('pixel analyzer recognizes low contrast without hallucinating image objects',()=>{
 const width=8,height=8;
 const data=new Uint8ClampedArray(width*height*4);
 for(let i=0;i<data.length;i+=4){data[i]=22;data[i+1]=23;data[i+2]=24;data[i+3]=255;}
 const result=imageMetrics({data,width,height});
 assert.ok(result.luminanceVariation<12);
 assert.match(imageMetricAdvice(result),/variação de luminosidade/);
});
