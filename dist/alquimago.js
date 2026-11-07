/* ALQUIMAGO v0.9.0 • MIT */
(() => {
"use strict";
const ALQUIMAGO_PRETRAINED={"inputHidden":[0.75575,-0.1088,0.39229,0.70326,-0.10493,-0.20607,-0.1176,-0.09376,0.77487,0.76291,-0.36778,-0.82718,-0.37809,-0.01008,-0.3081,-0.85638,0.64439,0.39989,-1.27606,0.31826,-0.56029,-0.53346,-1.74248,0.05001,0.058,-0.25732,-0.11166,-0.35875,-0.00776,-0.13262,0.23988,-0.56583,-0.09773,-0.21057,0.05366,-0.26502,0.14082,-0.37169,0.3559,-0.11472,0.16435,-0.25115,0.13055,0.09016,0.77275,0.31053,0.80076,0.12843,-0.05062,0.04483,-1.01095,0.14786,0.53428,0.16955,0.32239,0.26429,0.31101,0.13107,0.51052,0.18345,0.2165,-0.08181,-0.39637,-0.30113,0.95449,0.67053,-0.7952,-0.5093,0.58076,-0.44882,-0.05805,0.39766,-0.63327,-0.67252,-0.91978,0.31451,0.48118,-0.04168,-0.09103,-0.20879,0.38776,0.11656,0.75219,0.62643,-0.82717,0.32655,0.73471,-0.04273,-0.4106,-0.20494,-0.28238,-0.26243,0.24722,-0.13058,0.43751,0.24482,-0.94075,0.81203,-0.11353,0.17241,-0.56752,-0.56728,0.26173,-0.00737,0.52232,-0.0555,-0.41109,0.06578,0.19962,-0.08145,-1.6747,-0.07486,-0.51612,0.71845,-0.62466,0.0141,0.23295,-0.65338,0.2459,0.61789,-0.65716,0.3966,1.03744,-0.10599,-0.36394,-0.28617,0.28587,-0.0157,0.46838,0.73453,-0.65919,-0.1257,-0.29398,0.409,-0.9407,0.0357,-0.76926,-0.343,0.3216,0.27228,-0.58416,0.10783,0.08027,0.23494,0.35646,-0.58118,0.0529,0.89467,-0.51955,-0.5496,-0.27239,-0.19047,0.01074,-0.35463,-0.01634,0.13703,0.06965,-0.02701,0.8367,-0.05986,0.17037,0.30606,-0.38663,0.10381,0.40505,0.12583,-0.33991,-0.07374,0.46158,-0.14684,-0.46999,0.15811,-0.25442,-0.21052,0.70138,0.94163,-0.08096,0.74762,0.2718,0.23663,-0.056,0.37793,0.31656,-0.03219,0.49409,0.35367,0.3713,-0.31899,0.69532,-0.70671,-0.65698,-0.16349,0.31925,0.11291,-0.15066,-0.78687,0.21619,0.7066,-0.53662,-0.17406,0.03731,-0.57419,-0.2607,-0.33157,-0.0296,-0.34935,0.01646,0.06035,0.31145,0.04037,0.64942,0.23273,-0.57144,0.1846,0.27388,-0.32733,-0.35504,-0.44517,-0.11985,0.39743,-0.01914,-0.49499,-0.02079,-0.05326,-0.48418,0.1206,0.17648,0.19764,0.22668,0.16932,-0.42943,0.08382,-0.43929,-0.33728,0.09042,0.14658,0.12662,0.20852,0.14621,-0.13474,-0.63494,0.16927,0.13604,0.36535,-0.19397,-0.40016,0.047,0.14064,-0.62272,0.34247,-0.16299,-0.15131,0.00841,0.13354,-0.85385,0.1613,-0.71548,-0.54802,0.9509,0.1821,0.05022,-0.15879,0.37384,-0.1192,-0.3759,-0.2966,-0.8259,0.36234,0.45545,-0.13353,-0.14027,0.19281,0.02277,-0.35526,0.79617,0.38102,0.11076,0.04918,-0.04809,0.20442,0.31898,-0.19225,-1.03839,-0.44914,0.04606,0.06789,0.21553,0.29621,-1.36437,-0.95431,-1.16978,0.29296,0.54187,-0.1332,-0.5469,-0.15652,0.33893,-0.04748,0.96077,0.51464,-1.09539,0.57103,-0.56278,0.05571,-1.14718,-0.48354,-0.06192,0.05123,-0.83046,-0.23988,0.34997,0.34399,-0.37761,0.50118,-0.02977,-0.38997,0.40627,1.02892,-0.67116,-0.2242,1.24843,-0.26578,-0.21121,0.02026,-0.87126,0.1657,-0.22122,-0.36431,-0.4149,0.99581,-0.05276,0.38728,-1.24706,-0.54117,-0.5475,0.06109,0.09773,0.06719,-0.51778,-0.39617,0.5966,0.63865,-0.51812,-0.30765,0.52365,-0.71505,0.10184,0.60886,-0.28511,0.05027,1.05424,0.05725,0.10984,-0.08071,-0.55378,-0.14432,-0.99515,0.45086,0.07016,-0.11265,0.87676,0.81069,1.34417,-0.26601,-0.45908,-0.18548,0.39636,-0.22773,1.01261,0.59154,-1.62306,-0.91602,0.24654,-0.35843,-0.31246,-0.71422,0.65506,0.5901,-0.40009,0.33268,-0.24956,-0.24274,-1.11932,-0.09422,1.32991,0.69516,0.64459,-0.34656,-0.06527,0.00985,0.76404,0.57756,-0.65934,0.5241,-1.27274,-0.72227,0.83184,-0.36569,0.05746,-0.05437,1.14978,-0.34236,0.38653,-0.25499,-0.17451,0.06993,-0.24656,-0.52871,0.00631,0.39559,-0.19468,0.06418,-0.1607,0.04562,-0.08092,0.18743,-0.17513,-0.78526,-0.32361,0.90125,0.19382,-0.05482,0.75755,0.50463,0.27168,0.08237,0.00713,-0.26587,0.08742,0.39235,0.38143,-0.00519,-0.36753,0.13638,0.88948,-0.98152,-0.95938,-0.43107,0.74248,-0.37998,1.64883,0.5543,-0.60996,0.55509,-0.94272,0.47742,1.53554,-0.16072,-0.74246,0.67813,-0.10978,0.19103,0.48275,0.1979,-0.30198,0.48559,0.68572,0.01446,-0.33513,-0.22026,0.8265,0.77899,-0.01775,-0.31254,0.09383,-0.41677,0.21973,-0.42108,0.09849,-0.37551,0.50409,-0.39678,1.28723,0.35055,-0.46707,-0.10737,-0.10433,0.10214,0.01941,-0.04074,0.05937,0.03692,0.72848,-0.38831,-0.13535,-0.41191,0.78241,-0.31169,0.08138,0.94404,-0.19367,-0.57637,-0.23515,0.15323,1.02455,-0.50085,-0.20432,-0.09895,0.18479,0.26622,0.73855,0.5188,-0.01633,0.04903,-0.43722,0.03297,-0.45402,-0.39969,-0.1166,-0.47005,0.53251,-0.14962,0.80287,0.54681,0.10781,-0.17488,-0.59919,0.04362,0.42851,-0.48192,0.31917,0.39899,-0.59003,-0.1822,0.9202,-0.33185,0.26081,0.64558,-0.51657,0.17814,-0.75319,0.92108,-0.53449,-0.35346,0.1121,0.35082,0.1406,-0.16829,-0.07046,0.64022,-0.04531,-0.07041,-0.41794,0.02982,0.03786,1.15554,0.45494,-0.05145,1.20166,-1.05279,-0.00129,0.13055,-0.47743,0.36266,0.41324,-0.65593,-0.30783,0.69183,-0.5783,-0.07718,0.56468,-0.93143,-0.68542,1.01369,-0.46519,0.25621,0.66063,0.67498,-0.84695,0.20731,0.13323,0.2284,-1.30267,0.38617,0.16111,-0.09441,-0.0818,0.37959,0.09312,-0.35892,-0.3657,-0.14211,0.17256,0.36179,-0.14269,0.14963,-0.17653,-0.23433,0.31418,-0.23203,-0.87527,0.16089,0.01365,0.00808,-0.05195,-0.10599,0.04912,-0.13148,0.05206,0.0025,-0.82313,-0.65995,-0.3503,0.08457,0.23023,-0.25716,-0.42801,-0.01676,0.03849,0.26511,0.72759,0.18425,-0.73549,0.486,0.19144,0.09872,-1.06983,-0.5095,0.26689,0.20121,-0.57545,-0.13825,0.29656,0.04683,-0.70674,-0.00704,1.1234,0.29501,-0.2558,0.18269,0.11784,0.01221,-0.12296,0.52641,0.50973,0.55063,-0.25663,0.65216,0.64329,0.23074,-1.64915,0.15191,0.82626,0.26306,-0.24467,0.49817,-0.00456,-0.37849,-0.02418,-0.79525,-0.33177,0.9689,-0.19124,-0.57771,-0.81883,-0.53475,0.10083,-0.88518,0.43132,0.19525,0.40272,-0.29459,-0.45991,-0.07819,0.1725,0.13299,-1.62041,-0.00685,0.19167,-0.02111,-0.47391,0.23278,-0.68327,1.25175,-0.38606,-1.49251,0.84974,1.09408,0.31713,0.08881,1.7316,0.32926,-0.47223,0.52241,-1.28867,0.63502,0.81373,-0.13978,-0.18677,0.52168,-0.06416,-0.16222,-0.85953,0.07435,0.73528,0.66058,-0.15472,-1.29002,-0.0153,0.79439,-0.46464,-1.12068,0.57408,-0.29835,-0.21256,0.5067,1.04821,-0.31903,-0.02598,0.20294,0.79594,-0.24248,-0.35036,-0.23946,-0.3475,0.00599,1.65482,0.2429,-0.00318,0.33412,-0.59266,0.30896,0.41218,-0.20372,0.14456,-0.0858,0.18166,-0.36277,1.1803,-0.05701,0.1337,0.78818,-0.51806,0.4859,1.73786,-0.02871,-0.20076,0.32488,-1.38878,-0.26718,0.17107,0.75445,0.16993,0.69654,-0.32122,-0.23431,-1.09582,-0.06658,0.47053,-0.02137,-0.34853,-0.26616,-0.12141,-0.86384,0.77272,0.24671,0.10586,0.00534,-0.23967,0.35519,0.40886,-0.74919,-0.52218,-0.4015,0.08258,0.35386,1.1334,0.45744,-0.00364,0.40215,-0.48209,0.30515,0.09978,-0.70705,0.29658,0.23058,-0.74553,0.21346,-0.07619,-0.1735,0.65663,-0.08863,-1.09409,-0.02575,0.30067,-0.82825,-0.14273,-0.31935,0.02925,-0.11611,0.3304,-0.11107,-0.6835,-0.12328,0.72439,-0.31215,-0.63149,-0.14813,-0.02331,-0.4411,0.05615,-0.58373,0.20221,0.30194,0.12025,-0.21129,0.14033,0.19676,-0.98123,0.40902,0.28351,0.37522,0.56233,0.30114,0.74933,0.23886,-0.27422,-0.45834,0.03583,1.24197,-0.07376,-0.5638,-0.12376,-0.82619,0.43921,0.34401,0.05495,-0.25251,-0.3997,-0.13928,-0.12334,-0.69526,0.06104,0.77225,-0.41728,0.33359,0.80637,-0.42267,-0.4335,0.25,-0.13458,1.34387,0.55777,0.22437,-0.7998,-0.30833,0.65097,-0.11515,0.30141,-0.33529,-1.15193,-0.0209,0.98783,-0.74684,-1.33708,-0.14407,0.51307,1.0403,-0.72426,-0.07203,0.91717,-0.35614,-0.02859,0.32582,0.44191,0.91304,0.39598,-0.65488,-0.21283,-0.03398,0.77687,0.36846,0.3264,0.55032,-0.69424,-0.77451,0.40028,-0.18646,-0.20554,-0.47082,0.85774,0.25304,-0.31716,-0.10791,0.35952,-0.25649,-0.35972,0.12515,0.35002,0.08841,0.55051,-0.06567,-0.51987,-0.70864,0.38247,0.15913,-0.83497,0.98787,-0.13932,-1.29842,0.46099,-0.0934,-1.63118,0.00283,-0.12758,-0.6933,0.73976,0.25425,0.25717,-0.30479,-0.12502,-0.07168,0.65487,-0.21497,0.70656,0.193,0.15044,0.59935,-0.70508,-0.89995,1.6754,-0.53118,-0.45255,-0.10141,-0.75133,-0.15669,1.34692,-0.68839,0.68247,1.05539,-1.29801,0.47971,-0.73018,-0.00304,-1.19743,0.18601,0.26357,-0.37157,0.15831,0.74887,0.44271,0.71715,-0.62063,-0.10667,-0.69854,-0.31134,0.48708,0.08166,-0.06504,-0.24682,0.37546,0.04125,-0.12786,0.10784,0.44911,0.27986,-0.69467,0.22686,-0.13228,-0.45366,0.98096,0.27671,-0.69032,-0.35767,0.61843,0.27341,0.54581,0.54436,0.18344,0.8156,-0.30153,-0.82175,-0.06354,-0.08153,-0.09087,-0.40602,1.63781,-0.21828,-0.1943,-0.37532,0.0587,-0.59201,-0.51354,-0.03422,-0.50581,0.26678,-0.37408,-0.08287,0.06168,-0.00186,0.33597,0.13723,0.39269,0.18581,0.18145,0.35326,-0.31218,0.289,-0.00749,0.14406,-0.22624,0.1331,-0.35945,-0.32594,0.04999,-0.04854,0.3375,0.30586,-0.61419,-0.87846,-0.76087,0.69496,-0.07493,-0.90645,0.20303,-0.15936,0.26528,0.75346,0.87233,-0.21303,-0.57763,0.143,-0.27773,-0.3378,-0.39998,-0.02954,-0.26957,-0.03573,0.94972,-0.73384,0.0845,0.52659,0.06482,-0.64577,-0.44758,0.40666,-0.03695,-0.53755,-0.01636,0.35219,-0.6901,0.19707,0.40629,-0.01618,0.31234,-0.00439,-0.31801,0.20179,0.0962,-0.73869,0.15585,-0.3175,0.11094,-0.08264,0.09017,-0.10096,-0.21236,0.99854,0.69703,0.10026,-0.43358,0.04772,0.28824,-0.0535,0.11048,-0.09458,-0.67688,0.16366,0.44364,-0.32884,-0.39008,-0.02265,-0.17411,0.6306,-0.03106,0.11382,0.4145,0.00196,0.11522,-0.02494,-0.26313,-0.45669,0.03577,0.00585,-0.22634,-0.15423,-0.35508,-0.22184,0.17587,-0.20216,0.13221,-0.20327,-0.04163,-0.05279,-0.31063,0.02105,-0.18442,0.07386,-0.12871,0.27436,-0.2267,-0.21393,0.06305,0.20434,-0.23435,0.615,-0.27708,-0.20483,-0.56046,-0.03483,0.25051,0.35493,0.50748,-0.35637,-0.64874,0.78506,0.02529,0.07017,-0.1041,0.32993,0.11197,0.84672,0.29021,-0.17338,0.6988,-0.53501,0.16217,0.13953,0.49513,-0.67768,0.35785,-0.41299,0.486,0.6326,-0.57775,0.01699,0.1342,-0.28931,0.50884,-0.51718,-0.05994,0.01044,0.12842,-0.17028,0.18958,-0.02774,-0.60454,0.06111,-0.79706,0.19733,-0.71227,-0.00982,-0.25014,0.33288,0.8811,-0.6707,-0.45782,-0.12296,0.12618,0.0957,0.33804,0.01218,-0.54569,-0.0307,-0.11554,0.28537,-0.08264,0.10489,-0.49336,-0.22923,-0.0672,0.44595,-0.54918,0.22041,-0.14243,0.03267,0.78338,0.90283,0.4163,-0.36027,0.60031,0.91767,0.07291,0.19087,-0.63377,-0.01814,-0.7363,-0.61892,0.23645,-0.26321,-0.28884,-0.12412,0.57804,-0.00187,0.97934,0.18083,-0.50698,-0.04778,-0.02543,-0.56599,-0.01413,-0.16575,-0.17703,-0.35913,0.439,0.15593,-0.21138,0.10477,-0.43467,-0.19755,0.30916,-0.00481,0.34257,0.18576,0.25108,0.36596,-0.09629,-0.85221,0.20209,-0.33659,-0.62373,0.23105,0.58365,0.0008,-0.33847,0.12401,-0.8207,-0.27456,0.79573,0.21071,-0.23802,0.27867,0.51061,0.93327,0.11567,-0.59619,-1.01004,0.28023,-1.42405,-0.45476,-0.39473,-0.42267,0.46222,0.18191,-1.19494,-0.68718,-0.2661,0.25824,0.24801,0.28154,-0.02459,-0.34398,-0.11591,0.64004,-0.35175,-0.08743,0.36301,-0.91328,-0.68042,0.86204,-0.16432,-0.02748,1.08679,0.53079,0.07802,0.50143,0.44352,0.02569,-0.42686,0.19814,-0.06403,-0.30887,0.78482,-0.24788,0.11521,-0.80706,0.03248,-0.27958,0.16069,0.10692,0.26295,0.36555,-0.10781,-0.62314,-0.10042,0.24345,0.45347,0.02686,0.36052,-0.63895,-0.21272,-0.28595,-0.0024,0.16201,-0.15297,0.05888,0.23167,0.73927,-0.11881,-1.06341,0.44039,0.65246,0.14028,1.02783,0.21523,0.43769,-0.50676,0.16304,-0.32705,0.49476,-0.11717,0.42855,0.28349,-0.74572,0.47001,-0.27953,-1.62647,-0.25256,-0.13463,-0.158,0.12348,-0.1923,0.70511,-0.2479,-0.17966,0.23689,-0.72137,-0.57468,-0.3957,-0.78942,-0.21012,-0.13232,0.23486,-0.43578,-0.46567,0.10507,-0.51715,-0.09235,0.18281,0.50135,-0.5883,0.4517,0.0687,-0.40618,-0.06182,0.28309,0.773,-0.89771,-0.09418,0.4422,-0.63856,-0.21812,0.99647,-0.64211,-0.60208,0.15205,-0.3697,0.31165,0.35708,0.17142,-0.52086,0.16571,-0.3696,0.31397,-1.25171,0.04095,-0.31713,0.08047,0.06816,0.24728,-1.78069,-1.39847,0.95753,0.70479,0.31882,1.12347,0.6971,0.18175,0.71694,0.37576,-0.6541,0.50436,0.40347,0.23744,0.79293,-0.55273,-0.2686,-0.9366,-0.75733,-0.35408,0.44271,0.47496,-0.20097,0.15841,-0.53994,-1.02323,0.10792,0.11488,0.46435,0.50899,0.72556,0.63258,0.0047,-0.37699,-0.39099,0.23816,-0.40655,-0.07838,0.44682,0.0151,-0.0729,-0.26608,0.19452,-0.66623,0.03168,0.54714,-0.20513,0.08126,-0.00217,-0.53806,0.38674,0.3862,-0.14647,-0.02538,0.46138,-0.32213,0.44631,0.21025,0.13663,0.24619,0.44371,0.05802,-0.05522,-0.09434,-0.80502,-0.22475,-0.06838,0.28662,0.225,0.54055,-0.36434,0.0663,-0.09644,-0.03703,-0.42662,-0.42722,0.40925,-0.13424,0.05821,0.27378,-0.32188,-0.17949,-0.1371,0.01126,-0.37467,-0.13518,-0.07127,0.23373,0.31055,0.23796,0.63987,-0.0669,0.32924,0.19344,-0.00641,0.75723,0.00964,-0.8083,-0.25784,-0.35671,0.73683,0.6706,1.1687,0.6663,-0.55584,0.26644,-0.10744,0.66437,0.51779,-0.0737,0.78023,-0.02538,-0.84722,-0.52862,0.08264,-0.22612,-0.34861,0.60804,0.53855,0.0098,0.98842,-0.33875,-0.03281,0.33808,-0.18901,-0.33267,-0.30242,-0.2627,-0.28858,-0.36142,0.50722,-0.23971,0.32235,-0.00734,0.02726,-0.02368,0.12939,0.41165,-0.19989,0.36217,-0.31616,-0.46288,0.04787,0.09199,-0.76816,-0.25844,0.31255,0.08121,0.09462,0.15606,-0.66417,-0.57076,0.16648,0.30847,0.35365,-0.23674,-0.26006,0.4045,0.34952,-0.7484,0.43123,-0.45342,0.07803,0.22409,0.75264,-0.09676,0.16555,0.64886,-0.5612,-0.26539,0.43037,0.35445,-0.01754,-0.14931,0.74412,-0.43185,-0.60056,0.01825,-0.00535,-0.27755,-0.42451,-0.11306,0.59212,0.18404,-0.53434,-0.0485,-0.67411,-0.13352,0.32768,0.24144,-0.20896,-0.687,-0.51185,0.49299,0.66556,-0.00757,-0.75451,-0.87934,-0.09356,-0.38532,0.05988,-0.51687,-0.40291,0.01346,-0.62592,-0.17882,-0.12266,-0.6132,-0.28071,0.32549,-0.61478,0.13272,0.26471,0.16745,-0.35317,-0.44112,0.14006,0.04394,0.29854,0.06269,-0.40635,-0.48604,0.92524,0.00751,0.00211,-0.10416,-0.94781,0.31696,0.66606,-0.17221,-0.60135,-0.00122,-0.28472,0.39568,-0.72638,0.28404,-0.46962,0.06665,0.16022,0.35588,0.13402,0.06215,-0.63811,-0.71721,1.09856,0.49908,-0.51941,0.88955,-0.0151,-0.36442,0.76727,-0.06669,-0.77349,-0.03197,0.28306,-0.18779,0.4286,-0.16033,1.25437,-0.31394,0.07772,-0.06964,-0.40955,0.28906,-0.76685,-0.54272,-0.05556,0.08873,0.16736,0.24195,0.50266,-0.56034,-0.05481,1.26339,-0.11308,0.38383,1.53647,0.71087,0.12899,0.10145,-0.03968,-0.52507,0.44524,0.26374,0.82531,0.34009,0.37264,0.46975,-0.55771,0.1966,-0.18257,0.06493,0.23592,0.85736,-0.73299,-0.19777,-0.23412,0.53655,0.8292,-0.20548,-0.38672,0.45969,0.74816,-0.05033,0.18521,-0.55258,0.29732,-0.28063,0.02772,-0.37767,-0.29596,0.04485,-1.3537,-0.65849,-0.16158,-0.4162,0.36624,0.69728,0.00568,-0.51622,0.84649,1.07286,0.4313,0.26192,0.78283,0.56961,0.52743,0.06389,-0.33461,-0.78465,1.66098,-0.17611,0.88969,0.40763,-0.07689,-0.20493,-0.29063,0.32564,0.64819,0.51157,-0.09109,0.46609,-0.3602,-0.04256,0.61445,0.62583,-0.18395,0.24141,0.70425,0.22139,-0.09308,-0.43069,-0.22043,-0.1946,-0.62097,0.50268,0.1188,-0.10925,0.11885,0.25945,0.67989,0.09632,-0.63675,-0.31118,-0.14855,-0.20185,0.21133,-0.54362,-0.91142,0.5031,0.52229,-0.21979,0.36569,0.31173,0.13791,-0.0384,-0.67831,-0.16573,-0.1062,0.5615,0.09641,-0.08068,-0.1837,-0.33494,0.16438,-0.3202,-0.12167,-0.04427,-0.88728,-0.58217,0.02007,-1.26763,-0.00227,-0.03893,0.22551,-0.08116,-0.22961,0.23211,-0.78572,-0.65046,-0.31421,0.22836,-1.00093,0.59607,0.37985,-0.02288,0.35725,0.0375,0.41847,0.38026,-0.08453,-0.19799,0.39262,-0.19124,-0.3508,0.13787,-0.39789,-0.07113,0.43519,0.00415,0.94553,-0.11269,0.36434,-0.2377,-0.02123,-0.03683,0.15287,0.52131,0.11372,-0.24854,0.37529,-0.85445,1.16009,0.06307,0.28544,0.04077,-0.45425,-0.70926,0.17394,-0.00972,0.25233,-0.50817,-0.51336,-0.05152,1.07857,-0.53265,-0.36307,-0.12865,-0.387,0.61995,-0.96271,0.63063,-0.74049,-0.21146,0.05887,-0.51175,-0.30155,0.06776,-0.59698,-0.17974,0.19453,0.29768,-0.56338,-0.28904,0.43492,0.17676,0.19191,0.03772,0.37087,0.40532,-0.13018,0.25708,1.05537,-0.04356,0.92592,-0.21365,0.09098,-0.31565,0.10538,0.1679,-0.39315,0.75144,-0.19231,-0.4536,0.00163,-0.05128,0.20848,-0.13907,-0.44695,0.11272,0.06464,-0.03065,-0.26073,-0.16963,0.4831,0.1353,-0.64707,-0.19304,0.16235,-0.35783,-0.31482,-0.00933,-0.37827,-0.77644,-0.36043,0.19378,0.46179,-0.05306,-0.77104,-0.27054,0.00102,-0.70423,1.14469,0.32272,-0.05318,0.20464,0.40785,0.0233,-0.30641,-0.5581,-0.9395,-0.0553,-0.40887,0.49055,0.25788,0.3388,0.41967,-0.34565,0.1138,0.75564,-0.35175,-0.078,0.18326,0.02714,-0.5959,-0.05976,0.37027,-0.23059,0.4991,-0.54872,-0.82006,-0.11602,0.55868,0.99059,0.29589,-0.08452,1.16744,-0.51055,-0.50256,-0.07392,0.44081,-0.41533,0.33985,-0.17439,0.14142,0.47981,-0.4953,-0.17924,0.42689,-0.71623,0.40288,0.13906,0.27592,0.02724,1.11285,0.14137,0.37229,0.35938,-1.23284,0.00589,-0.09107,0.47371,-0.41757,0.18096,-0.21197,-1.02127,0.09393,-0.05351,-0.21433,-0.69591,-0.1057,-0.51618,-0.53424,0.60396,0.1636,-0.68383,-0.23,0.05663,-1.04849,-0.09001,-0.79172,-1.08642,0.8092,0.47852,0.07317,0.18625,0.4591,-0.07681,0.07439,1.41342,-0.89215,-0.67066,1.06527,1.09632,-0.31504,0.08224,0.31674,-0.42403,-0.72688,-0.05029,-0.0316,-0.18217,-0.64417,-0.05588,0.73821,0.1257,-0.04434,-0.28876,-1.46057,-0.24162,0.39993,0.15626,-0.50322,0.22502,-0.93152,0.45713,0.37173,-0.18245,-0.19365,0.25427,-0.01358,-0.1661,0.08714,0.23322,-0.08539,-0.0187,-1.03231,0.05359,0.12739,-0.1961,-0.63368,-0.48136,-0.45664,-0.37713,0.32244,0.42145,0.20491,-0.23706,-1.03271,-0.76219,0.46407,-0.03229,0.20571,0.03461,-0.45143,-0.05368,0.05546,-0.44769,-0.02118,0.05104,0.04164,0.14886,0.48403,-0.93217,0.73848,-0.27464,0.34503,-0.04972,0.93074,0.00064,0.27501,0.35266,0.01197,-0.31244,0.53095,0.74167,0.12315,0.17075,0.08312,0.27013,-0.14897,-0.11081,-0.30429,0.01616,0.31315,-0.12184,0.46389,0.43245,0.43641,0.13525,-0.65381,-0.11436,-0.1048,-0.14208,-0.62837,-0.52073,-0.32031,0.98357,-0.233,-0.49231,0.24879,-0.50671,1.75819,0.97978,0.59379,0.1319,-1.27014,0.36278,0.82804,-1.03336,0.15204,1.50894,-1.50887,0.07606,1.35631,-0.63019,-1.09704,1.01814,-1.1563,0.18899,0.12662,0.63978,-0.591,-0.47931,0.35795,-0.0659,-0.07459,0.24577,0.02821,0.90755,-0.32123,0.52722,0.28714,0.33153,-1.34985,-0.21036,0.56768,0.05436,0.33707,0.11111,0.56148,0.104,0.14718,-0.32479,0.01966,-0.98724,0.1215,0.44993,-0.59276,-0.22196,0.49832,-0.34939,-0.11197,-0.26167,-0.39858,0.03322,-0.32457,0.20782,-0.05197,-0.1277,0.15587,0.1291,-0.90195,0.00687,-0.0321,0.05131,0.28558,0.49583,0.83825,0.30693,-0.50596,-1.08588,1.12443,0.58738,0.47348,1.46687,-0.46436,-0.27217,0.07286,0.20293,0.39026,-0.57521,0.48689,0.45115,-1.0358,-0.14498,0.76274,-0.32129,-1.16597,0.08493,0.97859,0.76301,0.97179,-0.12276,0.13725,0.48486,0.1465,0.29859,-0.17036,0.03409,-0.61668,-0.24598,0.68003,-0.10132,0.63547,-0.06335,0.79861,-0.06488,-0.37572,-0.04748,-0.7079,0.44445,-0.6627,-0.42652,0.63249,0.33626,0.50486,-0.12527,-0.28468,-0.14994,0.14701,-0.14988,-0.1284,-0.22019,-0.41899,-0.5795,0.482,-0.31112,0.07236,-0.24039,0.56909,0.06124,-0.12624,0.16232,-0.01945,0.14925,-0.19303,-0.18659,0.16916,0.65533,-0.39084,-0.67549,0.06959,0.40699,0.05284,-0.07693,0.42265,-0.33972,-0.52071,0.42861,-0.02012,-0.02913,-0.17909,0.0121,0.55453,0.39348,0.17806,-0.12135,-0.30367,0.04512,0.22534,0.02783,-0.52562,0.01827,-0.79055,0.42361,0.35895,-0.05174,-0.45362,-0.05852,0.00357,-0.46532,0.47422,0.40715,-0.2916,-0.06758,-0.51891,0.1237,-0.42783,0.19242,-0.15228,-0.01001,-0.36931,-0.2604,0.24452,0.26895,0.40018,-0.00741,-0.09797,0.85002,-0.10786,-0.75346,0.16139,0.177,-1.09988,0.28007,-0.05303,-0.76362,0.99441,-0.38158,-1.44154,-0.00473,0.27375,-0.62392,0.29038,-0.14108,0.29175,-0.1811,-0.15905,-0.51589,-0.38826,0.12959,1.14572,0.0567,-0.36937,-0.02242,-0.0461,-0.44514,0.36256,-0.21087,0.077,0.40348,0.34278,-0.0874,0.75845,-0.12818,-0.50753,0.4303,-0.83651,0.30278,0.29853,0.68368,0.17193,0.27066],"hiddenBias":[0.12548,-0.44488,0.03405,0.30151,-0.04562,-0.06278,-0.27363,-0.0468,-0.58952,-0.09059,0.25564,-0.47847,0.38659,-0.23816,-0.32682,0.13942,-0.20997,-0.12737,0.5963,0.20563,0.10802,0.02672,0.06897,-0.40785],"hiddenOutput":[-0.72913,-2.82985,1.46836,0.05511,0.0584,-1.31759,2.53574,-0.45834,-0.28822,-0.0219,-0.42411,1.86832,-1.40523,1.02404,2.32638,-2.06583,-0.20598,0.15141,0.89245,-2.28858,2.69506,-0.72737,0.12337,-0.40932,-0.75849,1.23529,-1.20206,-0.09609,-0.68006,-1.55774,1.12882,-2.29684,0.98749,3.2504,-2.37484,2.60092,2.03741,-0.44825,-1.22945,3.36136,0.03671,-1.01923,0.01897,1.13036,0.92694,-1.37062,-2.5529,-0.71812,-0.33958,0.03553,2.34466,-0.02438,-1.83947,0.73817,-0.41746,1.59438,-1.51654,-1.46099,0.47928,0.52382,-0.91714,0.58156,2.5178,-1.69026,-0.24787,1.08453,-0.54626,-0.2402,-1.08464,-1.55531,-0.23928,2.4462,-0.08291,0.93068,-0.09135,-0.15667,0.00991,-1.59058,2.15462,-1.85558,0.75292,-0.06782,1.79628,-1.72464,0.18094,-0.01023,0.08944,-2.32421,0.46623,-0.17428,2.49225,0.40075,0.14336,-1.19613,0.87188,-1.03906,-3.99449,1.31725,-1.34063,0.53749,-0.37799,1.61811,-1.29327,-0.51181,1.1605,-0.64243,1.99144,1.65621,0.16141,1.1794,-1.14269,1.07127,-2.44482,-0.30117,3.62338,-1.39801,-0.20099,-0.11515,1.32608,-1.3878,2.44135,0.58898,-1.33377,0.35313,-0.49774,-0.84313,-1.29354,2.65287,-2.37744,-1.0074,1.24109,0.1058,-0.94457,1.82212,-0.37051,-1.01019,3.02424,0.00537,-1.79273,1.61925,0.42391,-1.52493,-0.30681,-0.6346,1.84095,-1.79048,0.91405,-1.42905,0.79125,-2.40819,0.81569,-0.40837,1.52579,0.89428,-0.50536,-0.09097,-1.0195,1.42268,-0.9936,-0.5253,-0.11257,0.43924,0.13843,0.8911,-0.70471,0.05364,0.76976,-0.5315,-3.99415,2.79475,-0.07244,0.94852,2.99988,-2.97817,-0.50903,0.87503,-2.51144,-0.0953,0.54108,2.04247,0.32834,0.13591,0.29595,-2.04788,1.7951,0.17531,-0.48545,0.84934,-0.38518,0.29829,-0.30335,-0.65471,-1.0453,-3.25146,2.27618,0.2943,0.24088,-1.43052,1.91276,-0.25488,0.89335,-2.07266,1.68022,0.59396,-0.33251,0.98911,-0.83594,1.31942,0.86151,-0.20474,-0.63482,-2.32644,1.77438,-2.5703,-0.26578,1.94091,2.16458,0.83235,1.61433,-0.86705,1.15113,1.48744,1.39406,-2.25403,-2.49431,0.53876,-1.74051,-1.69541,0.21034,0.33666,-0.54218,0.93387,-0.56638,0.78861,-0.35302,-0.92084,-0.18594,1.07899,-1.35308,0.99904,2.33391,0.00582,-1.95018,2.00963,2.54851,-3.88663,0.28312,-2.19474,0.68073,-0.53478,2.52264,-1.96002,-0.58379,0.91451,0.68183,-0.51228,0.06246,-1.41352,-1.26509,0.61125,-0.78379,1.90403,-0.82037,0.75486,1.11397,1.07822,1.84815,-1.19832,0.90055,0.14159,-2.38326,0.26267,-0.82526,0.52041,1.04298,-2.39144,-0.52194,0.52751,-0.93503,0.26022,-0.42003,0.20902,-1.23664,0.19393,0.61903,-0.35291,2.0315,-0.37697],"outputBias":[-0.13119,0.1046,0.06366,0.26977,-0.49993,0.2291,-0.34743,-0.27957,0.82471,0.50246,-0.32671,-0.40947],"version":1,"learned":0,"prototypes":[],"seedVersion":2};
// Alquimago 0.3 — symbolic familiar brain, not a language model.
// XP rewards exploration/meaningful discovery rather than repetitive clicking.
const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,n));
const DEFAULT_BRAIN=Object.freeze({
  energy:75,curiosity:58,focus:38,affinity:45,
  xp:0,interactions:0,lastAction:'summon',lastSeen:0,sleepUntil:0,
  lastRewardAt:0,lastRewardAction:'',rewardedPages:{}
});
const ACTIONS={
 pet:{energy:1,curiosity:0,focus:-1,affinity:3,xp:0},
 stroke:{energy:2,curiosity:1,focus:-2,affinity:5,xp:0},
 play:{energy:-8,curiosity:7,focus:-4,affinity:2,xp:2},
 focus:{energy:-3,curiosity:-1,focus:11,affinity:1,xp:2},
 rest:{energy:16,curiosity:0,focus:-2,affinity:0,xp:0},
 study:{energy:-2,curiosity:4,focus:5,affinity:0,xp:2},
 brew:{energy:-6,curiosity:5,focus:7,affinity:2,xp:3},
 explore:{energy:-1,curiosity:4,focus:1,affinity:1,xp:4},
 publish:{energy:-2,curiosity:3,focus:4,affinity:2,xp:10}
};
function restoreBrain(raw){
 const data=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const result={...DEFAULT_BRAIN,rewardedPages:{}};
 for(const key of ['energy','curiosity','focus','affinity'])
  if(typeof data[key]==='number'&&Number.isFinite(data[key]))result[key]=clamp(data[key]);
 for(const key of ['xp','interactions','lastSeen','sleepUntil','lastRewardAt'])
  if(typeof data[key]==='number'&&Number.isFinite(data[key]))result[key]=clamp(data[key],0,1e12);
 if(typeof data.lastAction==='string'&&Object.hasOwn(ACTIONS,data.lastAction))result.lastAction=data.lastAction;
 if(typeof data.lastRewardAction==='string')result.lastRewardAction=data.lastRewardAction.slice(0,40);
 const pages=data.rewardedPages&&typeof data.rewardedPages==='object'?data.rewardedPages:{};
 for(const [key,value] of Object.entries(pages).slice(-80)){
  if(/^[A-Za-z0-9_.#%-]{1,120}$/.test(key)&&typeof value==='number'&&Number.isFinite(value))
   result.rewardedPages[key]=clamp(value,0,1e12);
 }
 return result;
}
function applyAction(brain,name,now=Date.now(),detail=''){
 if(!Object.hasOwn(ACTIONS,name))return restoreBrain(brain);
 const next=restoreBrain(brain),action=ACTIONS[name];
 for(const key of ['energy','curiosity','focus','affinity'])next[key]=clamp(next[key]+action[key]);
 next.interactions=clamp(next.interactions+1,0,1e12);
 next.lastAction=name;next.lastSeen=now;
 next.sleepUntil=name==='rest'?now+3000:0;
 // No XP for petting, rest or passive UI changes. Other actions have cooldown.
 let earned=0;
 if(name==='explore'||name==='publish'){
  const safe=typeof detail==='string'&&/^[A-Za-z0-9_.#%-]{1,120}$/.test(detail)?detail:'';
  // Route XP once per day; each confirmed publication revision rewards once.
  const day=Math.floor(now/86400000);
  if(safe&&(name==='publish'?!Object.hasOwn(next.rewardedPages,safe):next.rewardedPages[safe]!==day)){
    earned=action.xp;next.rewardedPages[safe]=day;
  }
 }else if(action.xp>0){
  // 60s between rewards of the same action; 20s global spacing.
  const gap=now-next.lastRewardAt;
  if(gap>=20000&&(name!==next.lastRewardAction||gap>=60000))earned=action.xp;
 }
 if(earned){
  next.xp=clamp(next.xp+earned,0,1e12);
  next.lastRewardAt=now;next.lastRewardAction=name;
 }
 return next;
}
function passTime(brain,elapsedMs,now=Date.now()){
 const next=restoreBrain(brain),minutes=clamp(elapsedMs/60000,0,30);
 next.energy=clamp(next.energy+minutes*.55);
 next.curiosity=clamp(next.curiosity+minutes*.15);
 next.focus=clamp(next.focus-minutes*.22);
 next.lastSeen=now;
 return next;
}
function currentMood(brain,now=Date.now()){
 const b=restoreBrain(brain);
 if(b.sleepUntil>now)return 'meditando';
 if(b.energy<=23)return 'sonolento';
 if(['pet','stroke'].includes(b.lastAction)&&now-b.lastSeen<4500)return 'feliz';
 if(['play','brew'].includes(b.lastAction)&&now-b.lastSeen<4500)return 'animado';
 if(b.focus>=65&&b.lastAction==='focus')return 'concentrado';
 if(b.curiosity>=68)return 'curioso';
 return 'tranquilo';
}
function levelFromXp(xp){return Math.max(1,Math.floor(Math.sqrt(Math.max(0,xp)/8))+1);}

// Declarative, same-origin public configuration. JSON is never executable.
const DEFAULT_CONFIG = Object.freeze({
  schemaVersion:1,
  identity:{name:'Alquimago',subtitle:'Familiar arcano • memória local',greeting:'Olá! Sou seu familiar arcano.'},
  appearance:{accent:'#b58aff',gold:'#f9d891',position:'bottom-right',skin:{type:'svg'},skins:[{id:'padrao',label:'Alquimago padrão',type:'svg'}],selectedSkin:'padrao'},
  language:{code:'pt-BR',file:''},
  proactive:{projectHover:true,delayMs:1000,cooldownMs:45000},
  behavior:{enabled:true,mode:'equilibrado',minIntervalMs:120000,maxPerDay:4,toy:true},
  commands:{publishPhrase:'vai comprar pão'},
  knowledge:{file:''},
  llm:{enabled:false,endpoint:'',consentRequired:true},
  features:{actions:true,pageAudit:true,routes:true,assistants:true,memoryTools:true,dragging:true,projectFiles:true,dialogue:true},
  memory:{namespace:'default',remoteSnapshot:'',mode:'local'},
  project:{files:[]},
  messages:{pet:'Um brilho de amizade arcana! ✧',stroke:'Que carinho agradável! ✧',play:'Prepare-se: poção de diversão!',brew:'Elixir mágico concluído! ⚗',explore:'Rota estudada pelo familiar. ✦',focus:'Concentração ativada. 🜁',rest:'Meditando por alguns instantes.',study:'Analisando a energia da página.'},
  assistant:{projectContext:'',guidelines:[]}
});
const obj = x => x && typeof x==='object' && !Array.isArray(x) ? x : {};
const txt = (x, fallback, limit=160) => typeof x==='string' && x.trim() ? x.trim().slice(0,limit) : fallback;
const hex = (x, fallback) => typeof x==='string' && /^#[\da-fA-F]{6}$/.test(x) ? x : fallback;
function normalizeConfig(input){
  const data=obj(input), d=DEFAULT_CONFIG;
  const id=obj(data.identity), app=obj(data.appearance), features=obj(data.features);
  const memory=obj(data.memory), project=obj(data.project), messages=obj(data.messages), agent=obj(data.assistant);
  const language=obj(data.language),proactive=obj(data.proactive);
  const behavior=obj(data.behavior),commands=obj(data.commands);
  const knowledge=obj(data.knowledge),llm=obj(data.llm);
  const skins=Array.isArray(app.skins)?app.skins.slice(0,12).filter(entry=>
    entry&&typeof entry==='object'&&!Array.isArray(entry)&&
    typeof entry.id==='string'&&/^[a-zA-Z0-9_-]{1,35}$/.test(entry.id)
  ).map(entry=>({
    id:entry.id,
    label:txt(entry.label,entry.id,60),
    type:['svg','image','model3d'].includes(entry.type)?entry.type:'svg',
    src:typeof entry.src==='string'?entry.src.slice(0,500):'',
    shapeKeys:obj(entry.shapeKeys)
  })):[];
  const validSkins=skins.length?skins:d.appearance.skins;
  const selectedSkin=validSkins.some(x=>x.id===app.selectedSkin)?app.selectedSkin:validSkins[0].id;
  return {
    schemaVersion:1,
    identity:{name:txt(id.name,d.identity.name,40),subtitle:txt(id.subtitle,d.identity.subtitle,95),greeting:txt(id.greeting,d.identity.greeting,170)},
    appearance:{accent:hex(app.accent,d.appearance.accent),gold:hex(app.gold,d.appearance.gold),position:['bottom-right','bottom-left'].includes(app.position)?app.position:d.appearance.position,skin:obj(app.skin),skins:validSkins,selectedSkin},
    language:{code:txt(language.code,'pt-BR',32),file:typeof language.file==='string'?language.file.trim().slice(0,500):''},
    proactive:{projectHover:proactive.projectHover!==false,delayMs:typeof proactive.delayMs==='number'?Math.max(550,Math.min(4000,proactive.delayMs)):1000,cooldownMs:typeof proactive.cooldownMs==='number'?Math.max(20000,Math.min(600000,proactive.cooldownMs)):45000},
    behavior:{
      enabled:behavior.enabled!==false,
      mode:['silencioso','equilibrado','brincalhao'].includes(behavior.mode)?behavior.mode:'equilibrado',
      minIntervalMs:typeof behavior.minIntervalMs==='number'&&Number.isFinite(behavior.minIntervalMs)?Math.max(45000,Math.min(900000,behavior.minIntervalMs)):120000,
      maxPerDay:typeof behavior.maxPerDay==='number'&&Number.isFinite(behavior.maxPerDay)?Math.max(0,Math.min(8,Math.floor(behavior.maxPerDay))):4,
      toy:behavior.toy!==false
    },
    features:Object.fromEntries(Object.entries(d.features).map(([key,defaultValue])=>[key,typeof features[key]==='boolean'?features[key]:defaultValue])),
    memory:{namespace:typeof memory.namespace==='string'&&/^[\w-]{1,48}$/.test(memory.namespace)?memory.namespace:'default',remoteSnapshot:typeof memory.remoteSnapshot==='string'?memory.remoteSnapshot.trim().slice(0,512):'',mode:memory.mode==='publish'?'publish':'local'},
    project:{files:Array.isArray(project.files)?[...new Set(project.files.filter(x=>typeof x==='string'&&x.length<512))].slice(0,12):[]},
    commands:{publishPhrase:txt(commands.publishPhrase,d.commands.publishPhrase,80)},
    knowledge:{file:typeof knowledge.file==='string'?knowledge.file.trim().slice(0,500):''},
    llm:{enabled:llm.enabled===true,endpoint:typeof llm.endpoint==='string'?llm.endpoint.trim().slice(0,500):'',consentRequired:true},
    messages:Object.fromEntries(Object.entries(d.messages).map(([key,defaultValue])=>[key,txt(messages[key],defaultValue,170)])),
    assistant:{
      projectContext:typeof agent.projectContext==='string'?agent.projectContext.trim().slice(0,700):'',
      guidelines:Array.isArray(agent.guidelines)?agent.guidelines.filter(x=>typeof x==='string'&&x.trim()).slice(0,12).map(x=>x.trim().slice(0,220)):[]
    }
  };
}
async function loadConfig(path,{origin,base,fetcher}={}){
  if(!path)return normalizeConfig(null);
  const site=origin||globalThis.location?.origin;
  const target=new URL(path,base||globalThis.location?.href||'https://example.invalid/');
  if(!['https:','http:'].includes(target.protocol)||(site&&target.origin!==site))throw Error('A configuração deve estar na mesma origem do site.');
  const reader=fetcher||globalThis.fetch;
  if(typeof reader!=='function')return normalizeConfig(null);
  const response=await reader(target.href,{credentials:'same-origin',cache:'no-store'});
  if(!response.ok)throw Error('Configuração indisponível.');
  const body=await response.text();
  if(body.length>32768)throw Error('Configuração muito grande.');
  const parsed=JSON.parse(body);
  if(parsed?.schemaVersion!==undefined&&parsed.schemaVersion!==1)throw Error('Versão de configuração incompatível.');
  return normalizeConfig(parsed);
}

// Stable, origin-scoped memory keys survive deployments. Never persist credentials.
const LEGACY_KEY='alquimago:v1';
const MEMORY_VERSION=2;
const memoryKey=(ns='default')=>'alquimago:memory:v2:'+(/^[\w-]{1,48}$/.test(ns)?ns:'default');
const memoryObject=x=>x&&typeof x==='object'&&!Array.isArray(x)?x:{};
const num=x=>typeof x==='number'&&Number.isFinite(x);
function cleanMemory(value){
  const data=memoryObject(value),raw=memoryObject(data.brain),p=memoryObject(data.position),brain={};
  for(const k of ['energy','curiosity','focus','affinity','xp','interactions','lastSeen','sleepUntil','lastRewardAt'])
    if(num(raw[k]))brain[k]=Math.max(0,Math.min(1e12,raw[k]));
  if(typeof raw.lastAction==='string'&&['pet','stroke','play','focus','rest','study','brew','explore','publish','summon'].includes(raw.lastAction))brain.lastAction=raw.lastAction;
  if(typeof raw.lastRewardAction==='string'&&raw.lastRewardAction.length<40)brain.lastRewardAction=raw.lastRewardAction;
  if(raw.rewardedPages&&typeof raw.rewardedPages==='object'){
    brain.rewardedPages=Object.fromEntries(Object.entries(raw.rewardedPages).filter(([key,value])=>/^[A-Za-z0-9_.#%-]{1,120}$/.test(key)&&typeof value==='number'&&Number.isFinite(value)).slice(-80));
  }
  return {schema:2,brain,position:num(p.x)&&num(p.y)?{x:Math.max(0,Math.min(10000,p.x)),y:Math.max(0,Math.min(10000,p.y))}:null};
}
function readMemory(storage,namespace='default'){
  try{
    const prior=storage.getItem(memoryKey(namespace));
    if(prior)return cleanMemory(JSON.parse(prior));
    if(namespace!=='default')return cleanMemory(null);
    const legacy=storage.getItem(LEGACY_KEY);
    if(!legacy)return cleanMemory(null);
    const result=cleanMemory(JSON.parse(legacy));
    writeMemory(storage,result,namespace);
    return result;
  }catch{return cleanMemory(null);}
}
function writeMemory(storage,value,namespace='default'){
  try{storage.setItem(memoryKey(namespace),JSON.stringify(cleanMemory(value)));return true;}
  catch{return false;}
}
function parseBackup(text){
  if(typeof text!=='string'||text.length>180000)throw Error('Arquivo de memória inválido.');
  const result=JSON.parse(text);
  if(result?.schema!==1&&result?.schema!==2)throw Error('Versão de memória incompatível.');
  return cleanMemory(result);
}
const exportBackup=value=>JSON.stringify(cleanMemory(value),null,2);

// Read-only inspection of explicit public file URLs. Not a filesystem scanner.
const EXT=/\.(?:txt|md|json|csv|html|css|js|mjs|ts|tsx)$/i;
const FORBIDDEN=/(?:^|\/)(?:\.git|\.env(?:\.|$)|secrets?|private|credentials?)(?:\/|\.|$)/i;
function resolveProjectFile(value,pageUrl){
  if(typeof value!=='string'||!value.trim()||value.length>512)return null;
  try{
    const u=new URL(value,pageUrl),host=new URL(pageUrl);
    if(!/^https?:$/.test(u.protocol)||u.origin!==host.origin||!EXT.test(u.pathname)||FORBIDDEN.test(u.pathname)||u.username||u.password)return null;
    return u.href;
  }catch{return null;}
}
async function inspectProjectFiles(list,{pageUrl,fetcher,maxBytes=64000}={}){
  const reader=fetcher||globalThis.fetch,base=pageUrl||globalThis.location?.href;
  if(!base||typeof reader!=='function')return [];
  const files=[...new Set((Array.isArray(list)?list:[]).filter(x=>typeof x==='string'&&x.trim()))].slice(0,12);
  const results=[];
  for(const file of files){
    const url=resolveProjectFile(file,base);
    if(!url){results.push({file,status:'blocked'});continue;}
    try{
      const response=await reader(url,{credentials:'same-origin',redirect:'error',cache:'no-store'});
      if(!response.ok){results.push({file,status:'unavailable'});continue;}
      const size=Number(response.headers?.get?.('content-length'));
      if(Number.isFinite(size)&&size>maxBytes){results.push({file,status:'oversized'});continue;}
      const buffer=await response.arrayBuffer();
      if(buffer.byteLength>maxBytes){results.push({file,status:'oversized'});continue;}
      results.push({file,status:'read',bytes:buffer.byteLength,excerpt:new TextDecoder().decode(buffer).slice(0,2000)});
    }catch{results.push({file,status:'unavailable'});}
  }
  return results;
}

/** An explicitly configured, bounded public JSON snapshot, not arbitrary browsing. */
async function readPublicSnapshot(value,{pageUrl,fetcher,maxBytes=180000}={}){
 const base=pageUrl||globalThis.location?.href;
 if(!base)return null;
 const href=resolveProjectFile(value,base);
 if(!href||!new URL(href).pathname.endsWith('.json'))return null;
 try{
  const reader=fetcher||globalThis.fetch;
  if(typeof reader!=='function')return null;
  const response=await reader(href,{credentials:'same-origin',redirect:'error',cache:'no-store'});
  if(!response.ok)return null;
  const declared=Number(response.headers?.get?.('content-length'));
  if(Number.isFinite(declared)&&declared>maxBytes)return null;
  const body=await response.arrayBuffer();
  if(body.byteLength>maxBytes)return null;
  const parsed=JSON.parse(new TextDecoder().decode(body));
  return parsed&&typeof parsed==='object'&&parsed.schema===2?parsed:null;
 }catch{return null;}
}

// Privacy-preserving UI awareness: DOM metadata and public routes only.
// Never inspect input values, textarea contents, credentials or chats.
function routeSignature(url){
 try{const u=new URL(url);return (u.pathname+u.hash).slice(0,120);}catch{return '/';}
}
function readPublicPage(doc,locationUrl){
 const u=new URL(locationUrl),ids=[...doc.querySelectorAll('[id]')].map(x=>x.id);
 const imgs=[...doc.querySelectorAll('img')];
 const hash=(u.hash||'').toLowerCase();
 const route=hash.includes('contato')||hash.includes('contact')?'contact':
  hash.includes('portfolio')||hash.includes('gallery')?'gallery':
  hash.includes('sobre')||hash.includes('about')?'about':
  hash.includes('project/')?'project':
  hash.includes('page/')?'custom':'home';
 const editorial=!!doc.querySelector('.studio-dock,.studio-dock-root,[data-studio],.editor-overlay,.editor-panel');
 const heading=doc.querySelector('h1');
 const labels=[...doc.querySelectorAll('button')].filter(x=>!x.getAttribute('aria-label')&&!x.textContent.trim()).length;
 const metadata={
  route,signature:routeSignature(locationUrl),title:String(doc.title||'').slice(0,100),
  heading:!!heading,images:imgs.length,missingAlt:imgs.filter(i=>!i.hasAttribute('alt')).length,
  brokenImages:imgs.filter(i=>i.complete&&i.naturalWidth===0&&i.currentSrc).length,
  duplicateIds:ids.length-new Set(ids).size,unlabeledButtons:labels,
  links:doc.querySelectorAll('a[href]').length,editorial
 };
 return metadata;
}
function suggestionsFromPage(page){
 if(!page)return [];
 const suggestions=[];
 const push=(id,title,description)=>suggestions.push({id,title,description});
 if(page.missingAlt)push('alt','Imagens sem descrição',page.missingAlt+' imagem(ns) sem atributo alt. Revise a acessibilidade.');
 if(page.brokenImages)push('broken','Imagens com erro',page.brokenImages+' mídia(s) não carregaram corretamente nesta página.');
 if(page.duplicateIds)push('ids','IDs repetidos',page.duplicateIds+' identificador(es) duplicados podem atrapalhar links e acessibilidade.');
 if(!page.heading)push('heading','Hierarquia da página','A página atual não possui título principal (h1).');
 if(page.unlabeledButtons)push('buttons','Botões sem nome',page.unlabeledButtons+' botão(ões) sem rótulo acessível.');
 const labels={
  home:['Destaques da página','Confira se a chamada principal conduz à obra certa.'],
  gallery:['Galeria de projetos','Revise o enquadramento das capas em telas menores.'],
  project:['Apresentação do projeto','Verifique o ritmo entre imagens, descrição e detalhes da obra.'],
  contact:['Página de contato','Confira links de redes sociais e o espaço ocupado na tela.'],
  about:['Página sobre','Reforce o que torna a trajetória e as habilidades relevantes.'],
  custom:['Página personalizada','Revise se os blocos estão claros e têm bons pontos de ação.']
 };
 const [title,description]=labels[page.route]||labels.home;
 push('route',title,description);
 if(page.editorial)push('editor','Modo de edição','Há controles do editor na página. Revise a prévia antes de publicar.');
 return suggestions.slice(0,6);
}
function samePageSignature(a,b){
 return !!a&&!!b&&a.signature===b.signature&&a.images===b.images&&
 a.missingAlt===b.missingAlt&&a.brokenImages===b.brokenImages&&
 a.duplicateIds===b.duplicateIds&&a.unlabeledButtons===b.unlabeledButtons&&
 a.editorial===b.editorial;
}

// Recognition of gentle horizontal strokes, without requiring a mouse click.
// Pure and deterministic so browser gestures can be tested without the DOM.
function freshStroke(){return {lastX:null,legX:null,direction:0,reversals:0,distance:0,lastAt:0,lastTriggeredAt:-Infinity};}
function updateHeadStroke(previous,point){
 const state={...previous},time=Number(point?.time)||0;
 if(point?.pressed||point?.head!==true||!Number.isFinite(point?.x)){
   return {state:{...freshStroke(),lastTriggeredAt:state.lastTriggeredAt},triggered:false};
 }
 if(time-state.lastAt>1200 || time<state.lastAt){
   state.lastX=null;state.legX=null;state.direction=0;state.reversals=0;state.distance=0;
 }
 const x=point.x;
 if(state.lastX===null){state.lastX=x;state.legX=x;state.lastAt=time;return {state,triggered:false};}
 const dx=x-state.lastX;
 state.lastAt=time;state.lastX=x;
 if(Math.abs(dx)<3)return {state,triggered:false};
 const dir=Math.sign(dx);
 if(state.direction&&dir!==state.direction&&Math.abs(x-state.legX)>=16){
   state.reversals++;
   state.legX=x;
 }else if(!state.direction){state.legX=x;}
 state.distance=Math.min(1000,state.distance+Math.abs(dx));
 state.direction=dir;
 if(state.reversals>=2&&state.distance>=75&&time-state.lastTriggeredAt>=4500){
   state.reversals=0;state.distance=0;state.lastTriggeredAt=time;state.legX=x;
   return {state,triggered:true};
 }
 return {state,triggered:false};
}



// Local, transparent conversation engine. Not a model of language or remote chat API.
// It only reads text the visitor explicitly enters into the familiar's own chat.
function safeChatText(input){
 if(typeof input!=='string')return '';
 return input.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,320);
}
const plain=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function sensitiveChatText(text){
 return /(?:github_pat_|gh[pousr]_|\bsk-[a-zA-Z0-9]{12,}|\bAIza[a-zA-Z0-9_-]{20,}|\b(?:senha|password|token|secret|api\s*key)\b)/i.test(text);
}
function respondToChat(input,context={}){
 const raw=safeChatText(input),q=plain(raw);
 const name=context.name||'Alquimago',mood=context.mood||'curioso';
 const page=context.page||'home',level=Math.max(1,Number(context.level)||1),xp=Math.max(0,Number(context.xp)||0);
 const tips=Array.isArray(context.suggestions)?context.suggestions:[];
 if(!raw)return {reply:'Escreva uma pergunta ou escolha um dos assuntos do grimório.',intent:'empty'};
 if(sensitiveChatText(raw))return {reply:'Isso parece conter informações privadas. Não compartilhe senhas ou tokens comigo. Não registrei essa mensagem no histórico.',intent:'private',store:false};
 // Handle a user's answer BEFORE unrelated neural intent classification.
 const followup=answerFollowUp(raw,context.pending,{suggestions:context.suggestions});
 if(followup)return followup;
 const calculation=calculateBasic(raw);
 if(calculation)return {reply:'O resultado é '+calculation.text+'. ✦',intent:'math'};
 const grounded=answerFromKnowledge(raw,{knowledge:context.knowledge,lastProjectId:context.lastProjectId,focusTitle:context.focusTitle});
 if(grounded)return grounded;
 if(context.neuralIntent==='greeting'||/^(?:oi+e*|oie+|ola+|eai+|eae+|opa+|salve+)[!?. ]*$/.test(q)||/\b(bom dia|boa tarde|boa noite)\b/.test(q))
  return {reply:'Oi! Sou '+name+'. Conheço os projetos públicos deste site, posso resolver contas e sugerir melhorias. Diga o nome de uma obra ou faça uma pergunta.',intent:'greeting'};
 if(context.neuralIntent==='identity'||/\b(quem (e|eh) voce|seu nome|o que voce (e|eh)|vc (e|eh))\b/.test(q))
  return {reply:'Sou '+name+', um familiar arcano interativo. Tenho memória local, sentimentos simbólicos e observo apenas a estrutura pública da página. Ainda não sou uma IA conversacional completa.',intent:'identity'};
 if(context.neuralIntent==='status'||/\b(xp|nivel|experiencia|progresso|status|energia)\b/.test(q))
  return {reply:'Meu grimório registra nível '+level+' e '+xp+' XP. Carinhos aumentam nossa afinidade, mas não geram XP infinito. Explorar uma rota ou realizar uma tarefa relevante ajuda na evolução.',intent:'status'};
 if(context.neuralIntent==='pet'||/\b(carinho|acariciar|afagar|cabeca|cabecinha)\b/.test(q))
  return {reply:'Passe o mouse suavemente de um lado para o outro sobre meu chapéu, sem clicar! Também pode arrastar o dedo sobre minha cabeça no celular. ✧',intent:'pet'};
 if(context.neuralIntent==='play'||/\b(brincar|brincadeira|jogar|bolinha)\b/.test(q))
  return {reply:'Uma brincadeira arcana! Quer que eu comece? Responda sim ou não.',intent:'play',pending:{kind:'play'}};
 if(context.neuralIntent==='brew'||/\b(pocao|elixir|alquimia|mistura)\b/.test(q))
  return {reply:'Misturei três gotas de luar, uma runa violeta e muita curiosidade. Poção concluída! ⚗',intent:'brew',action:'brew'};
 if(context.neuralIntent==='rest'||/\b(descansar|dormir|sono|meditar)\b/.test(q))
  return {reply:'Vou meditar por um instante e recuperar minha energia arcana.',intent:'rest',action:'rest'};
 if(/\b(abra|abre|abrir|navegar|visitar|ir|vai|levar|leva)\b.*\b(galeria|portfolio|contato|sobre|inicio|home)\b/.test(q)){
  const target=q.match(/\b(galeria|portfolio|contato|sobre|inicio|home)\b/)?.[1]||'';
  return {reply:'Vou procurar a seção '+target+' na navegação pública do site.',intent:'navigate',target};
 }
 if(context.neuralIntent==='insight'||/\b(sugestao|melhorar|analisar|erro|problema|site|pagina|projeto)\b/.test(q)){
  const tip=tips.find(t=>!['route','studio'].includes(t.id))||tips[0];
  return {reply:tip?'Encontrei uma observação sobre '+page+': '+tip.title+'. '+tip.description+' Quer que eu mostre como continuar com uma IA?':'Estou acompanhando a seção '+page+'. Posso revisar títulos, imagens e navegação pública; para analisar o código completo, preciso de arquivos autorizados.',intent:'insight',...(tip?{pending:{kind:'ai-handoff'}}:{})};
 }
 if(context.neuralIntent==='help'||/\b(ajuda|comandos|o que (faz|sabe)|como funciona)\b/.test(q))
  return {reply:'Podemos conversar sobre XP, carinho, poções, emoções e sugestões do site. Também sei responder sim ou não conforme a pergunta anterior e calcular contas como 2 + 2 ou 12 dividido por 4.',intent:'help'};
 if(context.neuralIntent==='mood'||/\b(triste|feliz|humor|sentindo|emocao)\b/.test(q))
  return {reply:'Meu humor simbólico agora está '+mood+'. Ele reage aos cuidados, às brincadeiras e ao tempo, mas não significa que eu tenha sentimentos humanos.',intent:'mood'};
 if(context.neuralIntent==='thanks'||/\b(obrigado|valeu|agradeco)\b/.test(q))
  return {reply:'Sempre um prazer ajudar nas suas criações. ✦',intent:'thanks'};
 return {reply:'Ainda não tenho informação suficiente para responder com segurança. Posso consultar as obras públicas, falar sobre a página ou fazer contas. Se quiser uma resposta mais ampla, é necessário conectar um modelo de linguagem.',intent:'unknown'};
}

function dialogueKey(namespace='default'){
 const safe=/^[A-Za-z0-9_-]{1,48}$/.test(namespace)?namespace:'default';
 return 'alquimago:dialogue:v1:'+safe;
}
function readDialogue(storage,namespace='default'){
 try{
  const raw=JSON.parse(storage.getItem(dialogueKey(namespace))||'[]');
  if(!Array.isArray(raw))return [];
  return raw.slice(-24).filter(item=>
   item && ['user','familiar'].includes(item.role) &&
   typeof item.text==='string' && !sensitiveChatText(item.text)
  ).map(item=>({role:item.role,text:safeChatText(item.text)}));
 }catch{return [];}
}
function writeDialogue(storage,namespace='default',history=[]){
 const safe=Array.isArray(history)?history.slice(-24).filter(item=>
  item && ['user','familiar'].includes(item.role)&&typeof item.text==='string'&&!sensitiveChatText(item.text)
 ).map(item=>({role:item.role,text:safeChatText(item.text)})):[];
 try{storage.setItem(dialogueKey(namespace),JSON.stringify(safe));return true;}
 catch{return false;}
}

// Lightweight on-device neural intent classifier.
// 96 input feature neurons -> 24 hidden tanh neurons -> 12 intent output neurons.
// Trainable weights; never stores chat messages, credentials or raw text.
const INTENTS=['greeting','identity','status','pet','play','brew','rest','navigate','insight','help','mood','thanks'];
const INPUTS=96,HIDDEN=24,OUTPUTS=INTENTS.length;
const samples={
 greeting:['oi','oie','oii','oiii','olá','ola','ola tudo bem','oi tudo bem','oiee','eae','eai','eai mago','opa','salve','bom dia','boa tarde','boa noite','oi maguinho','hey','hello','hello friend','oi maguinho como vai','e aí tudo bem','salvee','ola alquimago','bom dia alquimago','boa noite mago','eae parceiro','saudacoes','opa tudo certo','e aí mago'],
 identity:['quem é você','seu nome','como você se chama','quem e voce','o que voce e','voce e uma ia','pra que voce serve','me conta quem voce e','me diz seu nome','voce tem cerebro','qual e sua funcao','o que voce consegue fazer','que tipo de familiar voce e','o que e alquimago'],
 status:['qual meu xp','quanto xp eu tenho','meu nivel','qual o nivel','quanta energia','meu progresso','status','quanto de xp tenho','como estou de xp','mostre meu progresso','to em qual nivel','quanta energia voce tem','quanto falta pra subir de nivel','quais os seus atributos','me mostra as estatisticas','quantos pontos eu tenho'],
 pet:['carinho','quero fazer carinho','como faço carinho','passar a mao na cabeca','posso te acariciar','afagar o mago','quer um carinho','posso passar a mao na sua cabeca','como dar carinho','vou fazer cafune','voce gosta de cafune','passa a mao no chapeu','como acariciar o maguinho','quero te fazer cafune'],
 play:['vamos brincar','quero brincar','brincadeira','jogar um joguinho','brincar com voce','quer brincar comigo','bora brincar','brincar agora','vamos jogar a bolinha','brincar de novo','quero jogar com voce','comeca uma brincadeira','ta afim de brincar'],
 brew:['pocao','poção','faz poção','criar elixir','mistura magica','alquimia','preparar pocao','bora fazer uma pocao','prepare um elixir','pode criar uma pocao','vamos misturar ingredientes','quero fazer magia','pocao de criatividade','quero mexer no caldeirao','me ajuda com alquimia'],
 rest:['dormir','descansa','vai descansar','meditar','hora de dormir','ta com sono','recarregar energia','voce precisa descansar','vai dormir mago','descansa um pouco','quero que voce medite','medite um pouco','precisa de energia','dorme um pouquinho','pausa para descanso'],
 navigate:['abra a galeria','abre a galeria','ir para contato','navegar para sobre','abrir portfólio','vai para inicio','mostra a home','abrir a pagina contato','vamos para galeria','me mostra a pagina de contato','quero entrar na home','como vou pra sobre','ir na area de projetos','abre os trabalhos','leva ate meu portfolio','quero ver a pagina inicial'],
 insight:['ideias para o site','me da sugestoes','sugestão pro site','analise esta pagina','como melhorar meu site','ache erros no projeto','dica de design','me da um feedback da obra','analise o projeto que estou vendo','o que achou desse projeto','quais pontos eu posso melhorar','me de uma critica construtiva','tem alguma dica de composicao','me da sugestoes de design','o que falta nessa pagina'],
 help:['ajuda','preciso de ajuda','o que voce faz','quais comandos','como funciona','comandos','ajude-me','me ajuda com isso','me explica seus recursos','me ensine como funciona','quais funcoes voce tem','me conta seus comandos','do que e capaz','como posso falar com voce','como voce aprende'],
 mood:['como esta seu humor','ta feliz','se sente bem','voce ta triste','qual seu humor','ta animado','como voce esta hoje','qual e seu estado atual','voce esta contente','ta de bom humor','como anda sua curiosidade','ta animadinho','como se sente','qual e a sua energia emocional'],
 thanks:['obrigado','valeu','muito obrigado','brigado','agradeco','thanks','obg','obrigada','obg mago','valeu demais','vlw','agradecido','brigada','muito grato','obrigado pela ajuda']
};
const neuralClamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
function canon(input){
 return String(input||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
 .replace(/(.)\1{3,}/g,'$1$1').replace(/[^a-z0-9\s]/g,' ').trim().replace(/\s+/g,' ').slice(0,120);
}
function hash(value){
 let n=2166136261;
 for(let i=0;i<value.length;i++){n^=value.charCodeAt(i);n=Math.imul(n,16777619);}
 return n>>>0;
}
function neuralFeatures(text){
 const s=canon(text),vec=Array(INPUTS).fill(0);
 if(!s)return vec;
 const tokens=s.split(' ');
 const features=[...tokens.map(w=>'t:'+w)];
 const padded='^'+s+'$';
 for(let i=0;i<padded.length-2;i++)features.push('3:'+padded.slice(i,i+3));
 for(let i=0;i<tokens.length-1;i++)features.push('p:'+tokens[i]+' '+tokens[i+1]);
 for(const feature of features)vec[hash(feature)%INPUTS]+=1;
 const norm=Math.hypot(...vec)||1;return vec.map(v=>v/norm);
}
function deterministic(index){return ((hash('arcane-seed-'+index)%20001)/10000-1)*.13;}
function newNeuralModel(){
 return {version:1,
  inputHidden:Array.from({length:INPUTS*HIDDEN},(_,i)=>deterministic(i)),
  hiddenBias:Array(HIDDEN).fill(0),
  hiddenOutput:Array.from({length:HIDDEN*OUTPUTS},(_,i)=>deterministic(i+3000)),
  outputBias:Array(OUTPUTS).fill(0),
  learned:0,prototypes:[],seedVersion:2
 };
}
function neuralForward(model,text){
 const x=neuralFeatures(text),hidden=Array(HIDDEN).fill(0),raw=Array(OUTPUTS).fill(0);
 for(let j=0;j<HIDDEN;j++){
  let z=model.hiddenBias[j];
  for(let i=0;i<INPUTS;i++)if(x[i])z+=x[i]*model.inputHidden[i*HIDDEN+j];
  hidden[j]=Math.tanh(z);
 }
 for(let k=0;k<OUTPUTS;k++){
  let z=model.outputBias[k];
  for(let j=0;j<HIDDEN;j++)z+=hidden[j]*model.hiddenOutput[j*OUTPUTS+k];
  raw[k]=z;
 }
 const highest=Math.max(...raw);
 const exp=raw.map(z=>Math.exp(neuralClamp(z-highest,-40,40)));
 const total=exp.reduce((a,b)=>a+b,0);
 const probs=exp.map(n=>n/total);
 const chosen=probs.indexOf(Math.max(...probs));
 return {intent:INTENTS[chosen],confidence:probs[chosen],probabilities:probs,x,hidden};
}
function trainNeural(model,text,intent,rate=.075){
 const target=INTENTS.indexOf(intent);
 if(target<0||!canon(text))return model;
 const {probabilities,x,hidden}=neuralForward(model,text);
 const outputError=probabilities.map((p,k)=>(k===target?1:0)-p);
 const hiddenError=Array(HIDDEN).fill(0);
 for(let j=0;j<HIDDEN;j++){
  let sum=0;for(let k=0;k<OUTPUTS;k++)sum+=outputError[k]*model.hiddenOutput[j*OUTPUTS+k];
  hiddenError[j]=sum*(1-hidden[j]*hidden[j]);
 }
 for(let k=0;k<OUTPUTS;k++)model.outputBias[k]=neuralClamp(model.outputBias[k]+rate*outputError[k],-5,5);
 for(let j=0;j<HIDDEN;j++){
  model.hiddenBias[j]=neuralClamp(model.hiddenBias[j]+rate*hiddenError[j],-5,5);
  for(let k=0;k<OUTPUTS;k++){
   const ix=j*OUTPUTS+k;
   model.hiddenOutput[ix]=neuralClamp(model.hiddenOutput[ix]+rate*outputError[k]*hidden[j],-5,5);
  }
 }
 for(let i=0;i<INPUTS;i++)if(x[i])for(let j=0;j<HIDDEN;j++){
  const ix=i*HIDDEN+j;
  model.inputHidden[ix]=neuralClamp(model.inputHidden[ix]+rate*hiddenError[j]*x[i],-5,5);
 }
 model.learned=neuralClamp((model.learned||0)+1,0,1000000);
 return model;
}
function seedNeuralModel(){
 // Standalone builds embed a validated, pre-trained immutable seed. This
 // skips ~15k training iterations during startup on mobile and older PCs.
 if(typeof ALQUIMAGO_PRETRAINED!=='undefined'){
  const ready=restoreNeuralModel(ALQUIMAGO_PRETRAINED);
  if(ready)return ready;
 }
 const model=newNeuralModel();
 const list=Object.entries(samples).flatMap(([intent,phrases])=>phrases.map(text=>({intent,text})));
 // Deterministic initial examples, no network or personal data.
 for(let epoch=0;epoch<85;epoch++)
   for(const entry of list)trainNeural(model,entry.text,entry.intent,.11);
 model.learned=0;
 return model;
}
function neuralPredict(model,text){
 const result=neuralForward(model,text);
 const profiles=Array.isArray(model.prototypes)?model.prototypes:[];
 let best=null,similarityToTaught=0;
 for(const entry of profiles){
  if(!entry||!Array.isArray(entry.features)||entry.features.length!==96||!INTENTS.includes(entry.intent))continue;
  const score=entry.features.reduce((total,n,i)=>total+n*result.x[i],0);
  if(score>similarityToTaught){similarityToTaught=score;best=entry.intent;}
 }
 // Explicit user teaching wins for the same phrase and very close variants.
 if(best&&similarityToTaught>=.90)return {intent:best,confidence:Math.min(.99,similarityToTaught),similarity:similarityToTaught,taught:true};
 // A softmax can be overconfident on unknown sentences. The nearest known
 // phrase provides an additional out-of-distribution similarity gate.
 const similarity=Math.max(0,...Object.values(samples).flat().map(sample=>{
  const vector=neuralFeatures(sample);
  return vector.reduce((sum,value,i)=>sum+value*result.x[i],0);
 }));
 return {intent:result.intent,confidence:result.confidence*similarity,similarity};
}
function teachNeural(model,text,intent){
 if(!INTENTS.includes(intent)||!String(text||'').trim())return false;
 const before=Math.max(0,Number(model.learned)||0);
 for(let n=0;n<32;n++)trainNeural(model,text,intent,.065);
 const vector=neuralFeatures(text);
 const profiles=Array.isArray(model.prototypes)?model.prototypes:[];
 // Numerical features only, no raw chat content. One prototype per corrected
 // phrasing. Keep the last 24 to bound file size and learning complexity.
 const features=vector.map(n=>Number(n.toFixed(5)));
 const existing=profiles.findIndex(entry=>entry?.features?.every((n,i)=>Math.abs(n-features[i])<.00001));
 if(existing>=0)profiles.splice(existing,1);
 profiles.push({intent,features});
 model.prototypes=profiles.slice(-24);
 model.learned=before+1;
 return true;
}
function restoreNeuralModel(value){
 if(!value||value.version!==1)return null;
 const arrays=[['inputHidden',INPUTS*HIDDEN],['hiddenBias',HIDDEN],['hiddenOutput',HIDDEN*OUTPUTS],['outputBias',OUTPUTS]];
 for(const [key,length] of arrays)
  if(!Array.isArray(value[key])||value[key].length!==length||!value[key].every(n=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<=5))return null;
 const prototypes=Array.isArray(value.prototypes)?value.prototypes.slice(-24).filter(entry=>
   entry&&INTENTS.includes(entry.intent)&&Array.isArray(entry.features)&&entry.features.length===INPUTS&&
   entry.features.every(n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=1)
  ).map(entry=>({intent:entry.intent,features:[...entry.features]})):[];
 return {...Object.fromEntries(arrays.map(([key])=>[key,[...value[key]]])),version:1,
  learned:typeof value.learned==='number'?neuralClamp(value.learned,0,1e6):0,prototypes,
  seedVersion:Number.isSafeInteger(value.seedVersion)?Math.max(1,Math.min(2,value.seedVersion)):1};
}
function serializeNeuralModel(model){
 const clean=restoreNeuralModel(model);
 return clean?{...clean,
  inputHidden:clean.inputHidden.map(n=>Number(n.toFixed(5))),
  hiddenOutput:clean.hiddenOutput.map(n=>Number(n.toFixed(5))),
  hiddenBias:clean.hiddenBias.map(n=>Number(n.toFixed(5))),
  outputBias:clean.outputBias.map(n=>Number(n.toFixed(5))),
  prototypes:clean.prototypes.map(entry=>({intent:entry.intent,features:entry.features.map(n=>Number(n.toFixed(5)))}))
 }:null;
}

function neuralKey(namespace='default'){
 return 'alquimago:neural:v1:'+(/^[A-Za-z0-9_-]{1,48}$/.test(namespace)?namespace:'default');
}
function upgradeNeuralSeed(model){
 const restored=restoreNeuralModel(model);
 if(!restored)return seedNeuralModel();
 if(restored.seedVersion>=2)return restored;
 const current=restored.learned,prototypes=restored.prototypes;
 // Teach the new, curated PT-BR examples without resetting personalized weights.
 for(let round=0;round<12;round++){
  for(const [intent,phrases] of Object.entries(samples))
   for(const sentence of phrases)trainNeural(restored,sentence,intent,.065);
 }
 restored.learned=current;
 restored.prototypes=prototypes;
 restored.seedVersion=2;
 return restored;
}
function readNeural(storage,namespace='default'){
 try{
  const raw=storage.getItem(neuralKey(namespace));
  if(!raw||raw.length>180000)return null;
  return upgradeNeuralSeed(JSON.parse(raw));
 }catch{return null;}
}
function writeNeural(storage,namespace,model){
 try{
  const valid=serializeNeuralModel(model);
  if(!valid)return false;
  storage.setItem(neuralKey(namespace),JSON.stringify(valid));
  return true;
 }catch{return false;}
}

// Advisory commentary on PUBLIC PROJECT METADATA. Never claims to have inspected
// artwork pixels, and never reads form fields or private editor data.
const trim=(v,n=150)=>typeof v==='string'?v.trim().slice(0,n):'';
const unique=x=>[...new Set(x)];
function projectMeta(element){
 if(!element||typeof element.getAttribute!=='function')return null;
 const title=trim(element.getAttribute('data-alquimago-project'),100);
 if(!title)return null;
 return {
  title,
  category:trim(element.getAttribute('data-alquimago-category'),70),
  year:trim(element.getAttribute('data-alquimago-year'),6),
  tools:trim(element.getAttribute('data-alquimago-tools'),150)
 };
}
const matches=(text,words)=>words.some(w=>text.includes(w));
function projectAdvice(meta){
 if(!meta?.title)return null;
 const category=(meta.category||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const title=meta.title;
 const tips=[];
 if(matches(category,['character','personagem','criatura','sculpt','character design']))
  tips.push('Confira a leitura da silhueta, a expressão facial e o equilíbrio entre detalhes grandes e pequenos.');
 if(matches(category,['environment','ambiente','cenario','world','scene']))
  tips.push('Uma boa apresentação destaca hierarquia visual, iluminação e profundidade entre primeiro plano e fundo.');
 if(matches(category,['game','jogo','interactive','interativo']))
  tips.push('Vale mostrar o ativo funcionando na engine, além da modelagem e do orçamento técnico quando relevante.');
 if(matches(category,['stylized','estilizado','handpaint','hand-painted','asset','prop']))
  tips.push('Teste se o material e as cores reforçam a leitura de formas antes dos microdetalhes.');
 if(matches(category,['motion','animation','anima']))
  tips.push('Mostrar breakdowns e timing ajuda a revelar as decisões de movimento por trás do resultado.');
 if(meta.tools)tips.push('Ferramentas informadas: '+meta.tools+'. Uma pequena nota sobre o processo agrega contexto técnico.');
 if(!tips.length)tips.push('Eu incluiria um detalhe de processo, desafios e decisões de direção de arte na página completa.');
 if(!meta.year)tips.push('Uma data de criação ajuda a mostrar a evolução dos projetos ao longo do portfólio.');
 const primary=tips[0];
 return {
  title,
  label:'Sobre '+title,
  comment:'Estou vendo o projeto "'+title+'" ('+(meta.category||'arte')+'). '+primary,
  tips:unique(tips).slice(0,3),
  disclaimer:'Opinião baseada nos metadados da obra, não na análise visual dos pixels.',
  category:meta.category
 };
}
function projectIdentity(meta){
 if(!meta?.title)return '';
 const str=[meta.title,meta.category,meta.year].join('|');
 let h=2166136261;
 for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}
 return (h>>>0).toString(36);
}
function shouldCommentProject(history,key,now,{cooldownMs=45000,maxPerSession=8}={}){
 if(!key)return false;
 const records=history&&typeof history==='object'?history:{};
 const last=records[key]||0;
 const count=Object.keys(records).length;
 return count<maxPerSession && (!last||now-last>=cooldownMs);
}

// Lightweight color/contrast assessment of PUBLIC same-origin portfolio covers.
// No remote inference, face detection, identification or hidden image uploads.
const imageClamp=(x,a,b)=>Math.min(b,Math.max(a,x));
function imageMetrics(pixels){
 if(!pixels||!pixels.data||!pixels.width||!pixels.height)return null;
 const d=pixels.data,w=pixels.width,h=pixels.height,total=Math.min(w*h,4096);
 let sum=0,sumSq=0,dark=0,bright=0,colors=0,saturation=0;
 const bins=new Set();
 for(let i=0;i<total;i++){
  const pos=i*4,r=d[pos],g=d[pos+1],b=d[pos+2],alpha=d[pos+3];
  if(alpha<40)continue;
  const light=.2126*r+.7152*g+.0722*b;
  sum+=light;sumSq+=light*light;
  if(light<45)dark++;if(light>210)bright++;
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  saturation+=(max-min)/255;
  bins.add((r>>5)+'-'+(g>>5)+'-'+(b>>5));
  colors++;
 }
 if(!colors)return null;
 const mean=sum/colors;
 const deviation=Math.sqrt(Math.max(0,sumSq/colors-mean*mean));
 return {
  brightness:Math.round(mean/255*100),
  luminanceVariation:Math.round(deviation/255*100),
  darkPercent:Math.round(dark/colors*100),
  brightPercent:Math.round(bright/colors*100),
  colorGroups:bins.size,
  saturation:Math.round(saturation/colors*100)
 };
}
function imageMetricAdvice(metric){
 if(!metric)return '';
 if(metric.luminanceVariation<12)return 'A capa tem pouca variação de luminosidade. Vale conferir o contraste e a leitura da silhueta em miniatura.';
 if(metric.darkPercent>78)return 'A capa tem predominância de tons escuros. Confira se o assunto principal continua legível em telas pequenas.';
 if(metric.brightPercent>72)return 'A capa tem muitas áreas claras. Verifique se detalhes e texto mantêm contraste suficiente.';
 if(metric.saturation<13)return 'A paleta é pouco saturada. Se essa for a intenção, confira se luz e volume ainda definem bem as formas.';
 if(metric.colorGroups>95)return 'A capa tem diversidade de cores. Um ponto focal claro pode ajudar a organizar a leitura visual.';
 return 'A distribuição geral de luz e cor parece equilibrada nesta amostra; observe a leitura do tema em tamanho reduzido.';
}
async function inspectCover(image,{pageUrl,scale=48}={}){
 if(!image||!image.complete||!image.naturalWidth)return null;
 try{
  const base=pageUrl||globalThis.location?.href;
  if(!base)return null;
  const src=image.currentSrc||image.src;
  const resolved=new URL(src,base),origin=new URL(base).origin;
  if(resolved.origin!==origin)return null;
  const side=imageClamp(scale,16,64);
  const canvas=document.createElement('canvas');
  canvas.width=side;canvas.height=side;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  if(!ctx)return null;
  ctx.drawImage(image,0,0,side,side);
  return imageMetrics(ctx.getImageData(0,0,side,side));
 }catch{return null;}
}

// Portuguese is the only built-in language. Other languages require a
// site-owned same-origin JSON pack; no automatic translation or external API.
const PT_BR={
 code:'pt-BR',
 tabs:{chat:'Conversar',insights:'Observar',actions:'Interagir'},
 ui:{
  close:'Fechar',send:'Enviar',message:'Escreva para o familiar...',
  learn:'Ensinar',learnTitle:'Qual era o significado da última mensagem?',
  learnSuccess:'Aprendi. Teste novamente essa frase.',
  publish:'Publicar alterações',cancel:'Descartar ao recarregar',
  projectTitle:'Análise de projeto',settings:'Ajustes',back:'Voltar',
  privacy:'Somente informações públicas da página são observadas.',
  status:'Memória temporária até publicar',
  autonomous:'Observação proativa',
  customSkin:'Aparência',
  copy:'Copiar para IA',
  noPreview:'Nenhum projeto observado ainda.'
 }
};
const plainObject=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
function normalizeLanguage(input){
 const d=plainObject(input),labels=plainObject(d.ui),tabs=plainObject(d.tabs);
 const safe=(value,fallback)=>typeof value==='string'&&value.trim()?value.trim().slice(0,140):fallback;
 return {
  code:safe(d.code,'pt-BR'),
  tabs:Object.fromEntries(Object.entries(PT_BR.tabs).map(([k,v])=>[k,safe(tabs[k],v)])),
  ui:Object.fromEntries(Object.entries(PT_BR.ui).map(([k,v])=>[k,safe(labels[k],v)])),
  intentLabels:Object.fromEntries(Object.entries(plainObject(d.intentLabels)).filter(([k,v])=>
    /^[a-z]{3,15}$/.test(k)&&typeof v==='string'&&v.length<=80)),
  responses:Object.fromEntries(Object.entries(plainObject(d.responses)).filter(([k,v])=>
    /^[a-z]{3,15}$/.test(k)&&typeof v==='string'&&v.length<=500)),
  intentSamples:Object.fromEntries(Object.entries(plainObject(d.intentSamples)).filter(([k,v])=>
    /^[a-z]{3,15}$/.test(k)&&Array.isArray(v)).map(([k,v])=>[k,v.filter(x=>typeof x==='string'&&x.length<=120).slice(0,12)]))
 };
}
async function loadLanguage(path,{pageUrl,fetcher}={}){
 if(!path)return normalizeLanguage(null);
 const base=pageUrl||globalThis.location?.href;
 if(!base)throw Error('URL da página indisponível');
 const href=new URL(path,base);
 if(href.origin!==new URL(base).origin || !/\.json$/i.test(href.pathname))throw Error('Idioma deve ser JSON público da mesma origem');
 const response=await (fetcher||globalThis.fetch)(href.href,{credentials:'same-origin',redirect:'error',cache:'no-store'});
 if(!response.ok)throw Error('Idioma indisponível');
 const raw=await response.text();if(raw.length>25000)throw Error('Idioma muito grande');
 return normalizeLanguage(JSON.parse(raw));
}

// Skin manifest: default SVG, a hosted image, or a custom GLB model rendered
// by an OPTIONAL host adapter. No network libraries are loaded by Alquimago.
const DEFAULT_SKIN={type:'svg',src:'',shapeKeys:{
 idle:'Idle',blink:'Blink',happy:'Happy',curious:'Curious',
 talk:'Talk',sleep:'Sleep',pet:'Pet',surprised:'Surprised',
 focused:'Focused',sad:'Sad'
}};
function normalizeSkin(value){
 const v=value&&typeof value==='object'&&!Array.isArray(value)?value:{};
 const type=['svg','image','model3d'].includes(v.type)?v.type:'svg';
 const source=typeof v.src==='string'&&v.src.length<500?v.src.trim():'';
 const shapes=v.shapeKeys&&typeof v.shapeKeys==='object'&&!Array.isArray(v.shapeKeys)?v.shapeKeys:{};
 const shapeKeys=Object.fromEntries(Object.entries(DEFAULT_SKIN.shapeKeys).map(([key,fallback])=>[
  key,typeof shapes[key]==='string'&&/^[\w .-]{1,64}$/.test(shapes[key])?shapes[key]:fallback
 ]));
 return {type,src:source,shapeKeys};
}
function safeSkinUrl(skin,pageUrl){
 try{
  const u=new URL(skin.src,pageUrl),p=new URL(pageUrl);
  if(!['https:','http:'].includes(u.protocol)||u.origin!==p.origin||u.username||u.password)return null;
  const image=/\.(png|jpe?g|webp|avif|gif|svg)$/i.test(u.pathname);
  const model=/\.(glb|gltf)$/i.test(u.pathname);
  return skin.type==='image'&&image||skin.type==='model3d'&&model?u.href:null;
 }catch{return null;}
}
function skinExpression(mood){
 return ({feliz:'happy',animado:'happy',curioso:'curious',meditando:'sleep',sonolento:'sleep',concentrado:'focused',triste:'sad'})[mood]||'idle';
}

// Tiny contextual preference learner, independent of chat and user identity.
// Only numerical feedback per broad art category; never stores project titles.
const BUCKETS=['character','environment','game','stylized','motion','general'];
function artBucket(category){
 const c=String(category||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 if(/character|personagem|sculpt|criatura/.test(c))return 'character';
 if(/environment|ambiente|cenario|scene/.test(c))return 'environment';
 if(/game|jogo|interactiv|interativ/.test(c))return 'game';
 if(/stylized|estilizado|asset|prop|handpaint/.test(c))return 'stylized';
 if(/motion|animation|animacao|anim/.test(c))return 'motion';
 return 'general';
}
function blankPreferences(){return {version:1,weights:{}};}
function cleanPreferences(value){
 const raw=value&&typeof value==='object'?value.weights:null;
 const weights={};
 if(raw&&typeof raw==='object')for(const [bucket,entries] of Object.entries(raw)){
  if(!BUCKETS.includes(bucket)||!entries||typeof entries!=='object')continue;
  weights[bucket]={};
  for(const [index,value] of Object.entries(entries)){
   if(!/^[0-4]$/.test(index)||typeof value!=='number'||!Number.isFinite(value))continue;
   weights[bucket][index]=Math.max(-8,Math.min(8,value));
  }
 }
 return {version:1,weights};
}
function rankTips(tips,category,preferences){
 const bucket=artBucket(category),weights=cleanPreferences(preferences).weights[bucket]||{};
 return (Array.isArray(tips)?tips:[]).map((text,index)=>({text,index,score:weights[index]||0}))
  .sort((a,b)=>b.score-a.score||a.index-b.index);
}
function learnTip(preferences,category,index,useful){
 const next=cleanPreferences(preferences),bucket=artBucket(category);
 if(!Number.isInteger(index)||index<0||index>4)return next;
 const values={...(next.weights[bucket]||{})};
 const old=values[index]||0;
 // Repeated ratings have diminishing effect and never create an endless feed.
 values[index]=Math.max(-8,Math.min(8,old+(useful?1:-1)));
 next.weights[bucket]=values;
 return next;
}
function readPreferences(storage,namespace='default'){
 try{
  const name=/^[\w-]{1,48}$/.test(namespace)?namespace:'default';
  return cleanPreferences(JSON.parse(storage.getItem('alquimago:prefs:v1:'+name)||'null'));
 }catch{return blankPreferences();}
}
function writePreferences(storage,namespace,preferences){
 try{
  const name=/^[\w-]{1,48}$/.test(namespace)?namespace:'default';
  storage.setItem('alquimago:prefs:v1:'+name,JSON.stringify(cleanPreferences(preferences)));
  return true;
 }catch{return false;}
}

/**
 * Independent behavioral cortex for Alquimago.
 *
 * 512 leaky integrate-and-fire cells / 16,384 deterministic sparse synapses.
 * 32 opt-in, privacy-preserving sensor channels and 16 action motor neurons.
 * Plasticity: reward-modulated motor value learning, bounded contextual
 * conditioning and synaptic traces for 128 eligible connections.
 *
 * This is a tiny decision network, not an LLM. It does not observe keystrokes,
 * other tabs, private window content or text typed into the host website.
 */
const CORTEX_CELLS=512;
const CORTEX_SYNAPSES=16384;
const CORTEX_SENSORS=32;
const CORTEX_MOTORS=16;
const CORTEX_ACTIONS=[
  'quieto','observar','dica','investigar','acenar','brilhar','brincar','meditar',
  'celebrar','curiosidade','pensar','estudar','poção','alongar','descansar','acolher'
];
const bClamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:a));
const bObject=x=>x&&typeof x==='object'&&!Array.isArray(x)?x:{};
const bHash=x=>{let h=2166136261;for(const c of String(x))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const B_BUCKETS=['home','gallery','project','contact','about','custom','desktop'];
const bContext=x=>B_BUCKETS.includes(x)?x:'home';
const B_REASON={
 quieto:'Descansando em silêncio.',
 observar:'Observando a organização pública desta página.',
 dica:'Encontrei uma possibilidade de melhoria acessível.',
 investigar:'Há uma seção nova para explorar.',
 acenar:'Uma saudação discreta.',
 brilhar:'Um pequeno efeito arcano.',
 brincar:'Momento para uma brincadeira opcional.',
 meditar:'Recuperando energia.',
 celebrar:'Uma nova etapa do projeto foi concluída.',
 curiosidade:'Há algo interessante na composição.',
 pensar:'Refletindo sobre as alternativas.',
 estudar:'Analisando o contexto público.',
 poção:'Uma pequena animação alquímica.',
 alongar:'Movimento curto e discreto.',
 descansar:'Recuperando energia.',
 acolher:'Um comentário amigável, sem interrupções.'
};
const DEFAULT_CORTEX=Object.freeze({
  schema:1,seed:77,energy:75,stimulation:42,curiosity:55,trust:45,
  rewardBias:Array(CORTEX_MOTORS).fill(0),
  contextWeights:{},adaptation:{},episodes:[],lastAction:'quieto',
  lastActionAt:0,lastDecisionAt:0,lastCue:'',feedbackCount:0,
  lastRewardAt:0,autonomousCount:0,lastActiveDay:-1,
  synapses:{}
});
function createCortex(seed=77){
 const s=Number.isSafeInteger(seed)?bClamp(seed,1,2147483647):77;
 return {...DEFAULT_CORTEX,seed:s,rewardBias:Array(CORTEX_MOTORS).fill(0),
  contextWeights:{},adaptation:{},episodes:[],synapses:{}};
}
function cleanCortex(value){
 const d=bObject(value);
 const state=createCortex(Number.isSafeInteger(d.seed)?d.seed:77);
 for(const key of ['energy','stimulation','curiosity','trust'])
  if(typeof d[key]==='number'&&Number.isFinite(d[key]))state[key]=bClamp(d[key]);
 for(const key of ['lastActionAt','lastDecisionAt','lastRewardAt','autonomousCount','feedbackCount'])
  if(typeof d[key]==='number'&&Number.isFinite(d[key]))state[key]=bClamp(d[key],0,1e13);
 if(Number.isInteger(d.lastActiveDay))state.lastActiveDay=bClamp(d.lastActiveDay,-1,1e9);
 if(CORTEX_ACTIONS.includes(d.lastAction))state.lastAction=d.lastAction;
 if(typeof d.lastCue==='string'&&d.lastCue.length<60)state.lastCue=d.lastCue;
 if(Array.isArray(d.rewardBias))
  state.rewardBias=d.rewardBias.slice(0,CORTEX_MOTORS)
   .map(x=>bClamp(x,-4,4));
 while(state.rewardBias.length<CORTEX_MOTORS)state.rewardBias.push(0);
 const contexts=bObject(d.contextWeights);
 for(const name of B_BUCKETS)if(Array.isArray(contexts[name])){
  state.contextWeights[name]=Array.from({length:CORTEX_MOTORS},(_,i)=>
   bClamp(contexts[name][i]||0,-3,3));
 }
 for(const [name,n] of Object.entries(bObject(d.adaptation)).slice(0,16))
  if(CORTEX_ACTIONS.includes(name)&&Number.isFinite(n))
   state.adaptation[name]=bClamp(n,0,1);
 const events=Array.isArray(d.episodes)?d.episodes.slice(-32):[];
 state.episodes=events.filter(x=>x&&CORTEX_ACTIONS.includes(x.action)&&
  B_BUCKETS.includes(x.context)&&[-1,0,1].includes(x.reward)&&
  Number.isFinite(x.at)).map(x=>({
   action:x.action,context:x.context,reward:x.reward,
   at:bClamp(x.at,0,1e13)
  }));
 for(const [i,v] of Object.entries(bObject(d.synapses)).slice(-128)){
  const key=Number(i);
  if(Number.isInteger(key)&&key>=0&&key<CORTEX_SYNAPSES&&Number.isFinite(v))
   state.synapses[key]=bClamp(v,-.45,.45);
 }
 return state;
}
function behaviorSense(info={},brain={}){
 const p=bObject(info),b=bObject(brain),v=Array(CORTEX_SENSORS).fill(0);
 const put=(i,x)=>v[i]=bClamp(Number(x)||0,0,1);
 const route=bContext(p.route);
 B_BUCKETS.forEach((x,i)=>put(i,x===route?1:0));
 put(7,bClamp(p.issues||0,0,12)/12);
 put(8,!!p.projectHover);
 put(9,!!p.routeChanged);
 put(10,!!p.publishConfirmed);
 put(11,!!p.userInteracted);
 put(12,bClamp((p.idleSeconds||0)/90,0,1));
 put(13,!!p.editorVisible);
 put(14,!!p.panelOpen);
 put(15,!!p.hidden);
 put(16,!!p.reducedMotion);
 put(17,bClamp((b.energy??75)/100,0,1));
 put(18,bClamp((b.curiosity??55)/100,0,1));
 put(19,bClamp((b.focus??40)/100,0,1));
 put(20,bClamp((b.affinity??45)/100,0,1));
 put(21,bClamp((p.mouseMoves||0)/20,0,1));
 put(22,!!p.visibleProject);
 put(23,!!p.hasBrokenMedia);
 put(24,!!p.hasAccessibilityIssue);
 put(25,!!p.hasNewProject);
 put(26,!!p.playful);
 put(27,!!p.quiet);
 put(28,!!p.working);
 put(29,!!p.nightMode);
 put(30,!!p.tutorial);
 put(31,1);
 return v;
}
/** The fixed topology is regenerable from the seed: no massive JSON file. */
function createCortexRuntime(state){
 const saved=cleanCortex(state),pre=new Uint16Array(CORTEX_SYNAPSES),
  post=new Uint16Array(CORTEX_SYNAPSES),weights=new Float32Array(CORTEX_SYNAPSES);
 let seed=(saved.seed^0xA53C7D21)>>>0;
 const random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
 for(let i=0;i<CORTEX_SYNAPSES;i++){
  pre[i]=i%CORTEX_CELLS;
  post[i]=i%31===0?CORTEX_CELLS-CORTEX_MOTORS+(i%CORTEX_MOTORS):
   Math.floor(random()*CORTEX_CELLS);
  const inhibitory=pre[i]%6===0;
  weights[i]=(inhibitory?-.30:.48)*(0.6+random()*.8);
  if(saved.synapses[i]!==undefined)weights[i]+=saved.synapses[i];
 }
 return {state:saved,pre,post,weights,
  voltage:new Float32Array(CORTEX_CELLS),spikes:new Uint8Array(CORTEX_CELLS),
  recentMotors:new Float32Array(CORTEX_MOTORS),lastContext:'home'};
}
/** Six short LIF iterations: integrates, leaks, fires and records motor spikes. */
function pulseCortex(engine,senses){
 const signal=Array.isArray(senses)&&senses.length===CORTEX_SENSORS?senses:Array(CORTEX_SENSORS).fill(0);
 const {pre,post,weights,voltage,spikes,recentMotors}=engine;
 recentMotors.fill(0);
 for(let tick=0;tick<6;tick++){
  const incoming=new Float32Array(CORTEX_CELLS);
  for(let i=0;i<CORTEX_SYNAPSES;i++)if(spikes[pre[i]])
   incoming[post[i]]+=weights[i];
  for(let n=0;n<CORTEX_CELLS;n++){
   // Deterministic background fluctuations; sensor evidence receives stronger input.
   const sensor=n<CORTEX_SENSORS?(.30+signal[n]*1.25):0;
   voltage[n]=bClamp(voltage[n]*.78+incoming[n]+sensor,-3,3);
   spikes[n]=voltage[n]>=1?1:0;
   if(spikes[n])voltage[n]=0;
   if(n>=CORTEX_CELLS-CORTEX_MOTORS)
    recentMotors[n-(CORTEX_CELLS-CORTEX_MOTORS)]+=spikes[n];
  }
 }
 for(let m=0;m<CORTEX_MOTORS;m++)recentMotors[m]/=6;
 return Array.from(recentMotors);
}
function planCortexAlternatives(state,info={},motors=[]){
 const s=cleanCortex(state),context=bContext(info.route),
  issues=Math.max(0,Number(info.issues)||0),
  changes=!!info.routeChanged;
 const scores=CORTEX_ACTIONS.map((name,i)=>{
  let weight=(s.rewardBias[i]||0)+(s.contextWeights[context]?.[i]||0);
  weight+=(motors[i]||0)*.35;
  if(name==='quieto')weight+=.8;
  if(name==='dica')weight+=issues>0?1.8+Math.min(issues,10)*.12:-.8;
  if(name==='investigar')weight+=changes?2:-.65;
  if(name==='observar')weight+=info.visibleProject?1.4:.2;
  if(name==='curiosidade')weight+=s.curiosity>65?1.2:0;
  if(name==='meditar'||name==='descansar')weight+=s.energy<30?2.2:-.45;
  if(name==='celebrar')weight+=info.publishConfirmed?3.5:-2;
  if(name==='brincar'||name==='poção')weight+=info.playful&&s.energy>38?1:-.7;
  if(name==='acenar'||name==='brilhar')weight+=.2;
  if(name==='pensar'||name==='estudar')weight+=info.working?.7:0;
  if(name==='acolher')weight+=s.trust>55?.3:0;
  if(info.quiet&&name!=='quieto')weight-=8;
  if(info.reducedMotion&&['brincar','brilhar','alongar','poção'].includes(name))weight-=4;
  if(info.panelOpen&&name!=='quieto')weight-=3;
  if(info.editorVisible&&['brincar','poção','alongar','acenar','brilhar'].includes(name))weight-=3;
  weight-=((s.adaptation[name]||0)*.8);
  return {action:name,score:weight,reason:B_REASON[name]};
 });
 return scores.sort((a,b)=>b.score-a.score);
}
function tickCortex(engine,info={},now=Date.now()){
 const state=engine.state,day=Math.floor(now/86400000);
 if(state.lastActiveDay!==day){
  state.autonomousCount=0;state.lastActiveDay=day;
 }
 const sensory=behaviorSense(info,info.brain||state);
 const motorSignals=pulseCortex(engine,sensory);
 state.stimulation=bClamp(state.stimulation+(sensory[8]+sensory[9]+sensory[10]?2:-.25));
 state.curiosity=bClamp(state.curiosity+(sensory[9]?2:-.08));
 state.energy=bClamp(state.energy+(info.working?-.35:.15));
 for(const name of CORTEX_ACTIONS)state.adaptation[name]=
  bClamp((state.adaptation[name]||0)*.92,0,1);
 const alternatives=planCortexAlternatives(state,info,motorSignals);
 const interval=Math.max(45000,Math.min(900000,Number(info.cooldownMs)||120000));
 const maxActions=Math.max(0,Math.min(8,Number.isFinite(info.dailyLimit)?info.dailyLimit:4));
 // Do not interrupt people typing, navigating, using the editor, watching a
 // dialog, or while this tab is hidden. The cortex still observes safe signals.
 const permitted=info.enabled===true&&!info.hidden&&!info.panelOpen&&
  !info.userBusy&&!info.quiet&&
  now-state.lastDecisionAt>=interval&&state.autonomousCount<maxActions;
 const best=alternatives.find(x=>x.action!=='quieto'&&x.score>1.2);
 const chosen=permitted&&best?best:null;
 if(chosen){
  state.lastAction=chosen.action;
  state.lastDecisionAt=now;
  state.autonomousCount++;
  state.adaptation[chosen.action]=1;
  state.lastCue=bContext(info.route);
 }
 engine.lastContext=bContext(info.route);
 return {action:chosen?.action||null,reason:chosen?.reason||null,
  alternatives:alternatives.slice(0,3),state,permitted,sensoryCount:CORTEX_SENSORS,
  motorSignals};
}
/** Reward-modulated conditioning, numeric episodes, no personal content. */
function rewardCortex(engine,action,context,reward,now=Date.now()){
 if(!CORTEX_ACTIONS.includes(action)||!Number.isFinite(reward))return engine.state;
 const s=engine.state,index=CORTEX_ACTIONS.indexOf(action),
  bucket=bContext(context),r=bClamp(reward,-1,1);
 s.rewardBias[index]=bClamp((s.rewardBias[index]||0)+r*.13,-4,4);
 const table=s.contextWeights[bucket]||Array(CORTEX_MOTORS).fill(0);
 table[index]=bClamp((table[index]||0)+r*.18,-3,3);
 s.contextWeights[bucket]=table;s.feedbackCount++;
 s.lastRewardAt=now;
 s.episodes.push({action,context:bucket,reward:r>0?1:r<0?-1:0,at:now});
 s.episodes=s.episodes.slice(-32);
 s.trust=bClamp(s.trust+r*1.5);
 // Only recently active, eligible synapses are adjusted. Persist a sparse,
 // bounded set instead of leaking the whole 16K connection graph to GitHub.
 if(r!==0){
  let written=0;
  for(let i=0;i<engine.pre.length&&written<128;i++){
   const pre=engine.pre[i],post=engine.post[i];
   if(post!==CORTEX_CELLS-CORTEX_MOTORS+index||!engine.spikes[pre])continue;
   const old=s.synapses[i]||0,delta=bClamp(old+r*.012,-.45,.45);
   s.synapses[i]=delta;engine.weights[i]=bClamp(engine.weights[i]+r*.012,-2,2);
   written++;
  }
  const keys=Object.keys(s.synapses);
  if(keys.length>128){for(const key of keys.slice(0,keys.length-128))delete s.synapses[key];}
 }
 return s;
}
function cortexSummary(state){
 const s=cleanCortex(state);
 return {neurons:CORTEX_CELLS,synapses:CORTEX_SYNAPSES,sensors:CORTEX_SENSORS,
  motors:CORTEX_MOTORS,learnedEpisodes:s.episodes.length,feedback:s.feedbackCount,
  preferred:CORTEX_ACTIONS[s.rewardBias.indexOf(Math.max(...s.rewardBias))]};
}

const cortexKey=(namespace='default')=>'alquimago:cortex:v1:'+
 (/^[a-zA-Z0-9_-]{1,48}$/.test(namespace)?namespace:'default');
function readCortex(storage,namespace='default'){
 try{
  const raw=storage?.getItem(cortexKey(namespace));
  if(!raw||raw.length>45000)return null;
  return cleanCortex(JSON.parse(raw));
 }catch{return null;}
}
function writeCortex(storage,namespace,state){
 try{
  if(!storage)return false;
  const text=JSON.stringify(cleanCortex(state));
  if(text.length>45000)return false;
  storage.setItem(cortexKey(namespace),text);
  return true;
 }catch{return false;}
}

/**
 * Small self-contained physics toy in a bounded Shadow DOM playfield.
 * No interaction with OS windows or user files.
 */
const pClamp=(n,min,max)=>Math.max(min,Math.min(max,Number.isFinite(n)?n:min));
function createOrb({x=75,y=24,vx=2.3,vy=-1.5,radius=11}={}){
 return {x,y,vx,vy,radius:pClamp(radius,6,24),sleeping:false,contacts:0};
}
function stepOrb(state,width=165,height=112,elapsed=1){
 const o={...state},r=pClamp(o.radius,6,24);
 const w=Math.max(r*2+2,width),h=Math.max(r*2+2,height);
 const dt=pClamp(elapsed,0,3);
 if(o.sleeping)return o;
 o.vy=pClamp(o.vy+.29*dt,-14,14);
 o.x+=o.vx*dt;
 o.y+=o.vy*dt;
 o.vx*=Math.pow(.995,dt);
 if(o.x<r){o.x=r;o.vx=Math.abs(o.vx)*.78;o.contacts++;}
 if(o.x>w-r){o.x=w-r;o.vx=-Math.abs(o.vx)*.78;o.contacts++;}
 if(o.y<r){o.y=r;o.vy=Math.abs(o.vy)*.74;o.contacts++;}
 if(o.y>h-r){
  o.y=h-r;
  o.vy=-Math.abs(o.vy)*.75;
  o.vx*=.985;
  o.contacts++;
  if(Math.abs(o.vy)<.38&&Math.abs(o.vx)<.14){o.vy=0;o.vx=0;o.sleeping=true;}
 }
 return o;
}
function tossOrb(state,x=3,y=-7){
 const o={...state};
 o.vx=pClamp(x,-11,11);o.vy=pClamp(y,-13,9);
 o.sleeping=false;
 return o;
}

/**
 * Exact owner-initiated Studio commands. A spoken phrase is a convenience
 * shortcut, NEVER a password, authorization proof, or autonomous permission.
 */
function normalizeCommand(text){
 if(typeof text!=='string')return '';
 return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLocaleLowerCase('pt-BR')
  .replace(/[.!?,;:]+$/g,'')
  .trim().replace(/\s+/g,' ').slice(0,100);
}
function recognizeStudioCommand(text,phrase='vai comprar pão'){
 const normalized=normalizeCommand(text),target=normalizeCommand(phrase);
 if(!normalized||!target)return null;
 return normalized===target?'prepare-publish':null;
}

/**
 * Portuguese conversation context and deterministic arithmetic.
 * Not an LLM: intended to cover dependable everyday interactions without
 * pretending that a small neural intent classifier can reason freely.
 */
const languageText=value=>String(value||'').normalize('NFD')
 .replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()
 .replace(/[!?.,;:]+$/g,'').replace(/\s+/g,' ').slice(0,240);
const AFFIRM=new Set(['sim','ss','sss','s','claro','claro que sim','isso','isso mesmo','pode','pode sim','pode ser','bora','vamos','vamos sim','com certeza','com ctz','comcerteza','positivo','quero','quero sim','aham','aham sim','uhum','uhum sim','beleza','ok','okay','fechou','ta bom','tá bom','faz','faz sim','por favor','pfv']);
const NEGATE=new Set(['nao','nn','n','nope','nops','negativo','de jeito nenhum','agora nao','hoje nao','melhor nao','nao quero','nao obrigado','nao obrigada','nem','nem pensar','deixa','deixa pra la','prefiro nao','dispenso','nao precisa','nao valeu']);
function yesNoIntent(value){
 const text=languageText(value);
 if(AFFIRM.has(text))return 'yes';
 if(NEGATE.has(text))return 'no';
 return null;
}
const NUMBERS={
 zero:0,um:1,uma:1,dois:2,duas:2,tres:3,quatro:4,cinco:5,seis:6,
 sete:7,oito:8,nove:9,dez:10,onze:11,doze:12,treze:13,
 quatorze:14,catorze:14,quinze:15,dezesseis:16,dezessete:17,
 dezoito:18,dezenove:19,vinte:20,trinta:30,quarenta:40,
 cinquenta:50,sessenta:60,setenta:70,oitenta:80,noventa:90,
 cem:100,cento:100,duzentos:200,trezentos:300,quatrocentos:400,quinhentos:500,
 mil:1000
};
function wordsToNumber(value){
 const chunks=value.split(/\s+e\s+/);
 if(chunks.length>4)return null;
 let total=0;
 for(const part of chunks){
  let segment=0;
  const words=part.split(/\s+/);
  for(const word of words){
   if(!Object.prototype.hasOwnProperty.call(NUMBERS,word))return null;
   if(word==='mil')segment=(segment||1)*1000;
   else segment+=NUMBERS[word];
  }
  total+=segment;
 }
 return Number.isFinite(total)&&total<=1e6?total:null;
}
function arithmeticText(value){
 let v=languageText(value).replace(/^(?:quanto e|quanto da|qual e o resultado de|qual o resultado de|calcule|calcula|resolva|resolva a conta|me diga quanto e)\s+/,'')
  .replace(/\s*(?:=)\s*$/,'').trim();
 // Recognizable, bounded word-number and arithmetic operators. Do not
 // accidentally calculate the XP, ID, year or unrelated strings.
 v=v.replace(/\b(?:vezes|multiplicado por)\b/g,' * ')
  .replace(/\b(?:dividido por|dividido|sobre)\b/g,' / ')
  .replace(/\b(?:mais|somado com)\b/g,' + ')
  .replace(/\b(?:menos|subtraido de)\b/g,' - ')
  .replace(/\b(?:elevado a|potencia de)\b/g,' ^ ')
  .replace(/(?<=[\d)])\s*[x×]\s*(?=[\d(])/g,' * ')
  .replace(/÷/g,' / ')
  .replace(/,/g,'.');
 v=v.replace(/\b(?:mil|cento|cem|noventa|oitenta|setenta|sessenta|cinquenta|quarenta|trinta|vinte|dezenove|dezoito|dezessete|dezesseis|quinze|quatorze|catorze|treze|doze|onze|dez|nove|oito|sete|seis|cinco|quatro|tres|dois|duas|uma|um|zero)(?:\s+e\s+(?:noventa|oitenta|setenta|sessenta|cinquenta|quarenta|trinta|vinte|dezenove|dezoito|dezessete|dezesseis|quinze|quatorze|catorze|treze|doze|onze|dez|nove|oito|sete|seis|cinco|quatro|tres|dois|duas|uma|um|zero))*/g,
  segment=>{const number=wordsToNumber(segment);return number===null?segment:String(number)});
 return v;
}
function calculateBasic(input){
 if(typeof input!=='string'||input.length>140)return null;
 const expr=arithmeticText(input);
 if(!expr||expr.length>100||!/[+\-*/^]/.test(expr))return null;
 if(/[^0-9.+\-*/^()\s]/.test(expr))return null;
 const raw=expr.match(/\d+(?:\.\d+)?|\.\d+|[+\-*/^()]/g);
 if(!raw||raw.length>45||raw.join('')!==expr.replace(/\s+/g,''))return null;
 let cursor=0,depth=0;
 function factor(){
  if(depth++>10)throw Error('complexity');
  const token=raw[cursor++];
  let value;
  if(token==='+'||token==='-'){
   value=(token==='-'?-1:1)*factor();
  }else if(token==='('){
   value=expression();
   if(raw[cursor++]!==')')throw Error('missing bracket');
  }else if(token&&/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(token)){
   value=Number(token);
  }else throw Error('invalid number');
  depth--;
  if(!Number.isFinite(value)||Math.abs(value)>1e12)throw Error('overflow');
  return value;
 }
 function power(){
  let x=factor();
  if(raw[cursor]==='^'){cursor++;const exponent=power();if(Math.abs(exponent)>12)throw Error('exponent');x=x**exponent;}
  return x;
 }
 function term(){
  let v=power();
  while(raw[cursor]==='*'||raw[cursor]==='/'){
   const op=raw[cursor++],next=power();
   if(op==='/'&&next===0)throw Error('division by zero');
   v=op==='*'?v*next:v/next;
   if(!Number.isFinite(v)||Math.abs(v)>1e12)throw Error('overflow');
  }
  return v;
 }
 function expression(){
  let v=term();
  while(raw[cursor]==='+'||raw[cursor]==='-'){
   const op=raw[cursor++],next=term();
   v=op==='+'?v+next:v-next;
   if(!Number.isFinite(v)||Math.abs(v)>1e12)throw Error('overflow');
  }
  return v;
 }
 try{
  const value=expression();
  if(cursor!==raw.length||!Number.isFinite(value))return null;
  const rounded=Number(value.toPrecision(12));
  return {expression:expr,value:rounded,text:String(rounded).replace('.',',')};
 }catch{return null;}
}
/**
 * Only a validated pending question can authorize a local safe action.
 * 'yes' on its own never navigates, publishes, logs in, or modifies files.
 */
function answerFollowUp(text,pending,context={}){
 const polarity=yesNoIntent(text);
 if(!polarity)return null;
 if(!pending||!['play','page-insight','ai-handoff','chat-or-insight'].includes(pending.kind)||
  !Number.isFinite(pending.at)||Date.now()-pending.at>5*60*1000)
  return {reply:'Entendi sua resposta, mas não tenho uma pergunta de sim ou não pendente. Pode me dizer a que você está respondendo?',intent:'clarify',pending:null};
 if(polarity==='no')
  return {reply:'Tudo bem! Não vou iniciar essa ação. Podemos continuar conversando ou escolher outra atividade.',intent:'decline',pending:null};
 if(pending.kind==='play')
  return {reply:'Combinado! Vamos brincar. ✦',intent:'followup',action:'play',pending:null};
 if(pending.kind==='page-insight'){
  const suggestions=Array.isArray(context.suggestions)?context.suggestions:[];
  const tip=suggestions.find(x=>x?.title&&x?.description);
  return {reply:tip?'Encontrei isto na página pública: '+String(tip.title).slice(0,80)+'. '+String(tip.description).slice(0,180):
   'Posso verificar títulos, imagens e navegação pública. Nesta página não encontrei um alerta específico.',intent:'followup',pending:null};
 }
 if(pending.kind==='ai-handoff')
  return {reply:'Certo! A opção “Continuar com IA” fica em Interagir → Ajustes e ferramentas. A escolha do serviço e o envio são feitos por você.',intent:'followup',pending:null};
 return {reply:'Claro! Posso ajudar com conversa, projetos, XP e pequenas contas. Sobre o que vamos falar?',intent:'followup',pending:null};
}
function pendingFromReply(reply,now=Date.now()){
 if(!reply||!['play','page-insight','ai-handoff','chat-or-insight'].includes(reply.pending?.kind))return null;
 return {kind:reply.pending.kind,at:now};
}

/**
 * Public-portfolio retrieval. No external services or guessing about artwork
 * pixels. This engine must be usable in any React site, not tied to an artist.
 */
const kText=(value,max=600)=>typeof value==='string'?value.replace(/[\u0000-\u001f\u007f<>]/g,' ').trim().slice(0,max):'';
const knowledgeCanon=value=>String(value||'').normalize('NFD')
 .replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR')
 .replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const STOP=new Set('um uma o a os as de do da dos das e em no na nos nas para por com que qual quais como quanto quantos meus minhas seus suas sobre este esse essa isso projeto projetos trabalho trabalhos obra obras arte artes me fala diga explica falar quero saber esse aqui dele dela ele ela do isso'.split(' '));
const SUBJECT=/\b(projeto|obra|arte|portfolio|galeria|trabalho|personagem|modelagem|sculpt|design|capa|frankie|alice|piplup)\b/;
const FEEDBACK=/\b(analisa|analisar|analise|avaliar|avaliacao|opina|opiniao|feedback|critica|melhorar|sugestao|dica|acha|achou|recomend)\b/;
const LIST=/\b(quais|liste|lista|mostre|mostrar|todos|quantos|quantas)\b/;
const TOOLS=/\b(ferramenta|ferramentas|software|softwares|programa|programas|usou|fez|feito|produziu|criou|modelou)\b/;
const YEAR=/\b(ano|quando|data|epoca|criado)\b/;
const CATEGORY=/\b(categoria|tipo|estilo|classe)\b/;
const PRONOUN=/\b(ele|ela|dele|dela|desse|dessa|dele|obra|projeto|essa|esse|deste|desta|aqui|nela|nele)\b/;
function safeProject(value){
 if(!value||typeof value!=='object')return null;
 const title=kText(value.title,100),id=kText(value.id,90);
 if(!title||!id||!/^[-a-zA-Z0-9_]{3,90}$/.test(id))return null;
 const tools=Array.isArray(value.tools)?value.tools.filter(t=>typeof t==='string').map(t=>kText(t,55)).filter(Boolean).slice(0,12):[];
 const category=kText(value.category,70),year=kText(String(value.year||''),8);
 const description=kText(value.description,650);
 return {id,title,category,year,tools,description,featured:value.featured===true};
}
function normalizeKnowledge(data){
 const root=data&&typeof data==='object'?data:{};
 const projects=Array.isArray(root.projects)?root.projects:
  Array.isArray(root.store?.projects)?root.store.projects:[];
 const seen=new Set(),out=[];
 for(const item of projects.slice(0,180)){
  const project=safeProject(item);
  if(!project||seen.has(project.id))continue;
  seen.add(project.id);out.push(project);
 }
 return {schema:1,revision:kText(root.revision,100),projects:out};
}
async function loadKnowledge(path,{pageUrl,fetcher}={}){
 const origin=pageUrl||globalThis.location?.href;
 if(!origin||typeof path!=='string'||!path.trim())return normalizeKnowledge(null);
 const target=new URL(path,origin),base=new URL(origin);
 if(target.origin!==base.origin||!target.pathname.endsWith('.json')||target.username||target.password)
  throw Error('Base de conhecimento precisa ser um JSON público da mesma origem');
 const resp=await (fetcher||globalThis.fetch)(target.href,{
  method:'GET',credentials:'same-origin',redirect:'error',cache:'no-store'
 });
 if(!resp.ok)throw Error('Base pública de projetos indisponível');
 const length=Number(resp.headers?.get?.('content-length')||0);
 if(length>190000)throw Error('Base pública grande demais');
 const raw=await resp.text();
 if(raw.length>190000)throw Error('Base pública grande demais');
 return normalizeKnowledge(JSON.parse(raw));
}
const keys=text=>knowledgeCanon(text).split(' ').filter(w=>w.length>2&&!STOP.has(w));
function relevance(text,project){
 const q=knowledgeCanon(text),title=knowledgeCanon(project.title);
 if(!title)return 0;
 const titleTokens=keys(title),queryTokens=keys(q);
 if(q.includes(title)&&title.length>=4)return 20+title.length/10;
 let score=0;
 for(const term of titleTokens){
  if(queryTokens.includes(term))score+=term.length>=6?6:4;
  else if(term.length>=5&&queryTokens.some(w=>w.startsWith(term.slice(0,5))||term.startsWith(w.slice(0,5))))score+=2;
 }
 return titleTokens.length?score/titleTokens.length:score;
}
function chooseProject(text,knowledge,lastId='',focusTitle=''){
 const records=knowledge.projects||[];
 const results=records.map(project=>({project,score:relevance(text,project)})).sort((a,b)=>b.score-a.score);
 if(results[0]?.score>=2.2)return results[0].project;
 if(PRONOUN.test(knowledgeCanon(text))||TOOLS.test(knowledgeCanon(text))||FEEDBACK.test(knowledgeCanon(text))){
  return records.find(p=>p.id===lastId)||
   records.find(p=>knowledgeCanon(p.title)===knowledgeCanon(focusTitle))||null;
 }
 return null;
}
function adviceFor(project){
 const c=knowledgeCanon(project.category+' '+project.title);
 if(/personagem|character|sculpt|criatura|face|rosto/.test(c))
  return 'Comece mostrando a silhueta, depois o acabamento e um detalhe de expressão. Um breakdown ajudaria a explicar suas decisões de modelagem.';
 if(/environment|cenario|ambiente|room|scene/.test(c))
  return 'Vale apresentar uma vista geral, um close dos materiais e um breakdown de iluminação. Isso facilita avaliar a composição e a profundidade.';
 if(/motion|animacao|animation/.test(c))
  return 'Mostre a animação completa e um breakdown do timing, das curvas e das decisões de movimento.';
 return 'Eu mostraria o resultado, um close técnico e um pequeno relato do processo. Assim, quem visita entende tanto a obra quanto as decisões de produção.';
}
function answerFromKnowledge(text,context={}){
 const knowledge=normalizeKnowledge(context.knowledge),q=knowledgeCanon(text);
 const projects=knowledge.projects;
 if(!q||!projects.length)return null;
 const project=chooseProject(text,knowledge,context.lastProjectId,context.focusTitle);
 const listQuestion=LIST.test(q)&&
  /\b(projetos|trabalhos|obras|portfolio|galeria|artes|quantos|quantas)\b/.test(q);
 if(listQuestion&&(!project||/\b(todos|quantos|quais|lista)\b/.test(q))){
  const featured=projects.filter(p=>p.featured).length;
  const names=projects.slice(0,9).map(p=>'“'+p.title+'”').join(', ');
  return {intent:'project-list',reply:'Neste portfólio há '+projects.length+' projeto'+(projects.length===1?'':'s')+' publicado'+(projects.length===1?'':'s')+
   ' ('+featured+' em destaque). Encontrei: '+names+(projects.length>9?' e outros.':'.')+
   ' Se quiser, pergunte sobre uma obra pelo nome.',projectId:null,source:'public-portfolio'};
 }
 if(!project)return null;
 if(TOOLS.test(q)){
  return {intent:'project-fact',projectId:project.id,source:'public-portfolio',
   reply:project.tools.length?'No projeto “'+project.title+'”, as ferramentas cadastradas são: '+project.tools.join(', ')+'.':
    'O projeto “'+project.title+'” está publicado, mas as ferramentas não foram informadas. Não vou inventar quais foram usadas.'};
 }
 if(YEAR.test(q)){
  return {intent:'project-fact',projectId:project.id,source:'public-portfolio',
   reply:project.year?'“'+project.title+'” está registrado no portfólio com o ano '+project.year+'.':
    'O ano de “'+project.title+'” não está informado nos dados públicos.'};
 }
 if(CATEGORY.test(q)){
  return {intent:'project-fact',projectId:project.id,source:'public-portfolio',
   reply:project.category?'“'+project.title+'” está classificado como '+project.category+'.':
    'O projeto “'+project.title+'” não tem categoria cadastrada.'};
 }
 if(FEEDBACK.test(q)){
  return {intent:'project-advice',projectId:project.id,source:'public-portfolio',
   reply:'Sobre “'+project.title+'”: '+adviceFor(project)+
   ' Minha análise se baseia na categoria e nos dados publicados, não em reconhecer todos os detalhes visuais da imagem.'};
 }
 if(SUBJECT.test(q)||relevance(q,project)>=2.2||PRONOUN.test(q)){
  const facts=[project.category?'categoria '+project.category:null,project.year?'ano '+project.year:null,
   project.tools.length?'ferramentas '+project.tools.join(', '):null].filter(Boolean);
  const description=project.description?
   ' Há uma descrição publicada para essa obra.' : ' Ainda não há descrição cadastrada.';
  return {intent:'project-info',projectId:project.id,source:'public-portfolio',
   reply:'Encontrei “'+project.title+'” no portfólio. '+(facts.length?facts.join('; ').replace(/^categoria /,'Categoria ')+'. ':'')+
   description.trimStart()+' Posso comentar a apresentação ou informar as ferramentas cadastradas.'};
 }
 return null;
}

/**
 * Optional REAL LLM transport. Disabled by default.
 * No model secrets in the bundle. Each request requires explicit consent.
 * Requests only the allowed server endpoint, never arbitrary web links.
 */
function validateModelEndpoint(value,{pageUrl}={}){
 if(typeof value!=='string'||!value.trim()||value.length>500)return null;
 try{
  const u=new URL(value,pageUrl||globalThis.location?.href);
  if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash)return null;
  if(!/^\/api\/assistant\/?$/.test(u.pathname))return null;
  return u.href;
 }catch{return null;}
}
function prepareModelConversation(prompt,history=[],project=null){
 const clean=x=>typeof x==='string'?x.replace(/[\u0000-\u001f\u007f]/g,' ').trim():'';
 const question=clean(prompt).slice(0,650);
 if(!question)return null;
 const safeHistory=Array.isArray(history)?history.slice(-8).filter(entry=>
  entry&&['user','familiar'].includes(entry.role)&&typeof entry.text==='string'
 ).map(entry=>({role:entry.role==='familiar'?'assistant':'user',content:clean(entry.text).slice(0,600)})):[];
 const context=project&&typeof project==='object'?{
  title:clean(project.title).slice(0,100),
  category:clean(project.category).slice(0,70),
  year:clean(project.year).slice(0,8),
  tools:Array.isArray(project.tools)?project.tools.slice(0,12).map(x=>clean(x).slice(0,55)):[]
 }:null;
 return {message:question,history:safeHistory,project:context,locale:'pt-BR'};
}
async function askLanguageModel({endpoint,prompt,history=[],project,fetcher,signal,pageUrl}){
 const url=validateModelEndpoint(endpoint,{pageUrl});
 if(!url)throw Error('A conexão com a IA não está configurada em um endpoint seguro.');
 const body=prepareModelConversation(prompt,history,project);
 if(!body)throw Error('Escreva uma pergunta para a IA.');
 const impl=fetcher||globalThis.fetch;
 if(typeof impl!=='function')throw Error('Conexão de rede indisponível.');
 const response=await impl(url,{
  method:'POST',credentials:'include',redirect:'error',cache:'no-store',
  referrerPolicy:'no-referrer',
  headers:{'Content-Type':'application/json','X-Alquimago-Request':'1'},
  body:JSON.stringify(body),signal
 });
 if(!response.ok){
  if(response.status===401)throw Error('É preciso conectar a conta autorizada para usar a IA.');
  if(response.status===429)throw Error('O limite de conversas com IA foi atingido. Continue no modo local.');
  throw Error('O serviço de IA está indisponível. O modo local continua funcionando.');
 }
 const data=await response.json();
 const text=typeof data.reply==='string'?data.reply.trim().slice(0,2600):'';
 if(!text)throw Error('O modelo não retornou uma resposta utilizável.');
 return {reply:text,engine:'generative',model:typeof data.model==='string'?data.model.slice(0,80):'modelo configurado'};
}




















const TAG = 'alquimago-familiar';
const STYLE = `
:host([data-position="bottom-left"]){right:auto;left:22px}
.tabs{overflow-x:auto}.tab{min-width:46px;padding:7px 4px}
:host{all:initial;position:fixed;z-index:2147483000;right:22px;bottom:20px;color:#f5eaff;font:13px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;--violet:#b58aff;--ink:#17101f;--gold:#f9d891;user-select:none;box-sizing:border-box}
:host([data-mode="desktop"]){position:relative;right:auto;bottom:auto;display:block;width:100%;height:100%}
*{box-sizing:border-box}
.shell{position:relative;display:flex;align-items:flex-end;flex-direction:column;gap:6px;filter:drop-shadow(0 8px 21px #13082258)}
:host([data-mode="desktop"]) .shell{width:100%;align-items:center;padding-top:26px}
.character{appearance:none;border:0;background:transparent;width:116px;height:143px;padding:0;cursor:grab;position:relative;touch-action:none;transform-origin:bottom center;animation:levitate 3.4s ease-in-out infinite}
.character:focus-visible,.action:focus-visible,.menu:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
.character:active{cursor:grabbing}
.character svg{width:116px;height:143px;overflow:visible}
.character .eyes{animation:blink 6.3s infinite;transform-origin:center}
.character[data-mood="meditando"] .eyes,.character[data-mood="sonolento"] .eyes{transform:scaleY(.18);animation:none}
.character[data-mood="animado"]{animation:levitate 1.5s ease-in-out infinite}
.character[data-mood="concentrado"] .rune{animation:spin 4s linear infinite;transform-origin:58px 91px}
.familiar-title{display:flex;gap:7px;align-items:center;border:1px solid #a67fdd69;background:linear-gradient(110deg,#24162fea,#3e275be9);color:#f5e8ff;border-radius:999px;box-shadow:0 8px 25px #1e0e2b72;padding:6px 10px;cursor:pointer}
.familiar-title strong{font-size:12px;letter-spacing:.1px}.familiar-title small{color:#c9adeb;font-size:10px}
.panel{width:min(308px,calc(100vw - 24px));border:1px solid #9567c6b8;border-radius:17px;background:linear-gradient(165deg,#291b38f5,#141020f7);color:#f6eeff;box-shadow:0 12px 42px #13072291;backdrop-filter:blur(17px);overflow:hidden;display:none}
.panel.open{display:block}
:host([data-mode="desktop"]) .panel{display:block;width:285px;max-height:calc(100vh - 220px);overflow:auto}
.panel-header{padding:14px 15px 12px;border-bottom:1px solid #72508b57;background:#ffffff08}
.panel-header .row{display:flex;align-items:center;justify-content:space-between;gap:8px}.subtitle{font-size:11px;color:#c4abd7;margin-top:5px}
.tabs{display:flex;gap:4px;padding:8px;border-bottom:1px solid #ffffff16}
.tab{border:0;flex:1;border-radius:9px;padding:7px 3px;color:#e8d9f4;background:transparent;font:inherit;font-size:11px;cursor:pointer}
.tab.selected{background:#8151a842;color:#ffebbf}
.content{padding:12px 13px;min-height:130px;max-height:235px;overflow-y:auto}
.line{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 0;font-size:12px}
.line small,.muted{color:#c4a6d5;font-size:11px}
.actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}
.action,.menu{font:inherit;font-size:11px;color:#f5e8ff;border:1px solid #a88ac066;background:#57376f8f;border-radius:9px;padding:8px 10px;cursor:pointer}
.action:hover,.menu:hover{background:#7c4a9c}.action:disabled{opacity:.5;cursor:default}
.action.primary{background:#7a4c9c;border-color:#b98adb}
.badge{display:inline-block;color:#fff0c9;background:#8d642b50;border:1px solid #dfb36b6b;padding:2px 7px;border-radius:999px;font-size:10px}
.stat{height:5px;background:#ffffff20;border-radius:6px;overflow:hidden;margin:2px 0 8px}.bar{height:100%;border-radius:6px;background:linear-gradient(90deg,#a76bea,#e5a8ff)}
.list-item{display:block;width:100%;text-align:left;color:#eee1ff;background:#ffffff0a;border:1px solid #ffffff15;border-radius:7px;padding:7px;margin:5px 0;font:inherit;font-size:11px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.feedback{border-top:1px solid #ffffff20;font-size:11px;padding:9px 13px;color:#dec4f1;min-height:34px}
.hidden{display:none!important}
@keyframes levitate{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-8px) rotate(1deg)}}
@keyframes blink{0%,44%,48%,100%{transform:scaleY(1)}46%{transform:scaleY(.07)}}
@keyframes spin{to{transform:rotate(360deg)}}

/* Arcane familiar • refined panel & meaningful gestures */
:host{--violet:#b58aff;--ink:#110c21}
.shell{gap:9px}
.character{width:124px;height:155px;filter:drop-shadow(0 8px 12px #08051b99)}
.character svg{width:124px;height:155px}
.character:hover{filter:drop-shadow(0 0 13px #a768f681) drop-shadow(0 10px 10px #0b0525a6)}
.character .arc-sigils{animation:spin 36s linear infinite;transform-origin:58px 93px}
.character .potion-spark{animation:twinkle 2.2s ease-in-out infinite}
.character .potion-bubble{animation:twinkle 1.6s ease-in-out infinite}
.character[data-mood="feliz"] .arc-mouth{stroke-width:3}
.character[data-mood="animado"]{animation:levitate 1.25s ease-in-out infinite}
.familiar-title{border-color:color-mix(in srgb,var(--violet),#251438 40%);background:linear-gradient(115deg,#231335ed,#130e25ef)}
.panel{width:min(338px,calc(100vw - 18px));border:1px solid #ad78de91;background:linear-gradient(150deg,#251637f7,#110d20fa 75%);box-shadow:0 20px 60px #060113b0}
.panel-header{background:radial-gradient(ellipse at 80% 0%,#8a5cf21e,transparent),#ffffff06}
.panel-header b{font-size:14px;letter-spacing:.02em}
.tab{font-size:11px;white-space:nowrap}
.tab.selected{background:color-mix(in srgb,var(--violet) 32%,#21132f);color:#fff1d4}
.content{max-height:min(335px,45vh)}
.action{min-height:35px}
.action.primary{background:linear-gradient(125deg,#7043b3,#47277e)}
.action:hover,.list-item:hover{border-color:var(--violet)}
.insight{padding:11px;margin:8px 0;border:1px solid #9276af5a;border-radius:12px;background:#ad81f711;line-height:1.55}
.insight b{display:block;color:#f4e6ff;margin-bottom:3px}
.insight span{color:#cab7df;font-size:11px}
.thought{max-width:205px;border:1px solid #b991f37a;border-radius:12px 12px 3px 12px;background:#251635f2;padding:7px 11px;line-height:1.3;font-size:10px;color:#f1e3ff;box-shadow:0 5px 19px #06020d77;align-self:flex-end}
.thought:empty,.thought[hidden]{display:none!important}
:host([data-position="bottom-left"]) .thought{align-self:flex-start;border-radius:12px 12px 12px 3px}
:host([data-position="bottom-left"]) .shell{align-items:flex-start}
@keyframes twinkle{0%,100%{opacity:.45;transform:scale(.92)}50%{opacity:1;transform:scale(1.12)}}
@media(max-width:460px){:host{right:8px;bottom:9px}.panel{width:min(315px,calc(100vw - 16px))}.character{width:100px;height:128px}.character svg{width:100px;height:128px}}


/* Conversa local e gestos de afeto — sem dependências externas */
.content .chat-history{
 display:flex;flex-direction:column;gap:8px;min-height:125px;
 max-height:200px;overflow-y:auto;padding:4px 2px 11px;scrollbar-width:thin;
}
.chat-bubble{max-width:93%;font-size:12px;line-height:1.55;padding:9px 11px;border-radius:13px;overflow-wrap:anywhere;user-select:text}
.chat-bubble.from-user{align-self:flex-end;background:#67419d;border:1px solid #9a6fc5;color:#fff}
.chat-bubble.from-familiar{align-self:flex-start;background:#332243;border:1px solid #634a7f;color:#ecdcff}
.chat-form{display:flex;align-items:center;gap:6px;margin-top:7px}
.chat-form input{min-width:0;width:100%;flex:1;background:#140d22;border:1px solid #72548f;border-radius:11px;color:#fff;padding:10px 9px;font:inherit;font-size:12px;user-select:text}
.chat-form input:focus-visible{outline:2px solid var(--violet);outline-offset:1px}
.chat-send{min-width:37px;height:37px;border:1px solid #af83dc;background:#6a3f9b;color:#fff;border-radius:11px;cursor:pointer}
.chat-suggestions{display:flex;flex-wrap:wrap;gap:5px;margin:10px 0}
.chat-suggestions button{font:inherit;font-size:10px;color:#f8e8ff;background:#4b305f;border:1px solid #8563a3;border-radius:15px;padding:6px 9px;cursor:pointer}
.thought{color:#f2e5ff;text-align:left;cursor:pointer;max-width:205px;font:inherit;font-size:11px}
.affection-burst{pointer-events:none;position:absolute;top:14%;left:20%;font-size:19px;letter-spacing:8px;color:#ffacd8;animation:affection-rise .95s ease-out forwards;text-shadow:0 0 10px #f394f3}
@keyframes affection-rise{0%{opacity:0;transform:translateY(10px) scale(.8)}25%{opacity:1}100%{opacity:0;transform:translateY(-40px) scale(1.3)}}
.sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}


/* Avoid filter creating a containing block for fixed-position panel. */
.shell{filter:none!important}
/* Responsive, opaque and truly viewport-bounded grimório. The panel is not in
   the mascot's vertical flow, so short monitors no longer cut it off. */
:host{isolation:isolate}
:host([data-publishing="true"]){display:none!important}
.panel{
 position:fixed!important;
 z-index:2147483600;
 right:clamp(132px,11vw,165px);
 left:auto;top:auto;bottom:10px;
 width:min(360px,calc(100vw - 175px));
 height:auto;max-height:calc(100dvh - 20px);
 min-height:0;
 overflow:hidden;
 background:#171023!important;
 background-image:linear-gradient(155deg,#302040,#161022 70%)!important;
 backdrop-filter:none!important;
 box-shadow:0 20px 65px #04010cf0,0 0 0 1px #b78cee50;
 pointer-events:auto;
 overscroll-behavior:contain;
}
.panel.open{display:flex!important;flex-direction:column}
.panel:not(.open){display:none!important}
.panel-header,.tabs,.feedback{flex:0 0 auto}
.panel-header{background:#261933!important}
.panel-header .row{gap:5px}
.panel-header .row b{flex:1;min-width:0;font-size:12px!important}
.panel-close{
 display:grid;place-items:center;width:27px;height:27px;flex:0 0 27px;
 background:#482e60;border:1px solid #b286ce;border-radius:9px;
 color:#f7e8ff;font:15px system-ui;cursor:pointer;
}
.content{
 flex:1 1 auto;min-height:0!important;
 max-height:none!important;
 overflow-y:auto;overscroll-behavior:contain;
 padding:12px!important;
}
.tabs{overflow-x:auto;scrollbar-width:thin}
.tab{flex:0 0 auto;min-width:46px}
.feedback{max-height:70px;overflow-y:auto;background:#1a1129}
.chat-history{min-height:45px!important;max-height:min(220px,32dvh)!important}
.neural-teach{
 display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:8px;
 padding:8px 0;border-top:1px solid #8b66a746;
}
.neural-teach label{color:#dec8f2;font-size:10px}
.neural-teach select{
 flex:1 1 115px;min-width:0;background:#20122f;color:#f5e8ff;
 border:1px solid #906ab7;border-radius:8px;padding:6px;font:11px system-ui;
}
.neural-teach button{
 background:#653b90;border:1px solid #ab83d4;color:#fff;
 border-radius:8px;padding:6px 9px;font:11px system-ui;cursor:pointer;
}
.session-note{
 font-size:11px;line-height:1.5;padding:8px 10px;margin-top:9px;
 border:1px solid #a77cd158;border-radius:10px;background:#362244;
 color:#e9d3f4;
}
:host([data-position="bottom-left"]) .panel{
 right:auto;left:clamp(132px,11vw,165px);
}
:host([data-mode="desktop"]) .panel{
 position:relative!important;right:auto!important;left:auto!important;
 top:auto!important;bottom:auto!important;max-height:calc(100dvh - 230px);
 width:min(320px,100%);overflow:hidden;
}
@media(max-width:720px){
 .panel,.panel.open,:host([data-position="bottom-left"]) .panel{
  position:fixed!important;
  top:8px;bottom:8px;right:8px;left:8px;
  width:auto!important;height:auto!important;max-height:none!important;
  border-radius:15px;
 }
 .panel.open{display:flex!important}
 .content{padding:10px!important}
}
@media(max-height:430px){
 .panel,.panel.open,:host([data-position="bottom-left"]) .panel{
  top:5px;bottom:5px;max-height:calc(100dvh - 10px);
 }
 .panel-header{padding:8px 10px}
 .tabs{padding:5px}
 .feedback{padding:5px 10px;min-height:20px}
}


/* Teaching is discoverable but does not crowd the conversation. */
.neural-lesson{margin:9px 0;padding:8px 10px;background:#24172f;border:1px solid #8b65af70;border-radius:10px}
.neural-lesson summary{color:#ead6ff;font-size:12px;font-weight:600;cursor:pointer}
.neural-lesson .neural-teach{margin-top:8px}

.arcane-orb-field{
 position:absolute;right:2px;bottom:160px;width:165px;height:112px;
 border:1px solid #9269c884;background:#1c1231e9;border-radius:14px;
 z-index:3;overflow:hidden;box-shadow:0 8px 32px #11051c99;
 pointer-events:auto;touch-action:none;
}
.arcane-orb{
 position:absolute;top:0;left:0;width:22px;height:22px;padding:0;border:0;
 border-radius:50%;color:#261340;font:16px system-ui;font-weight:bold;
 background:radial-gradient(circle at 30% 25%,#fff6c3,#dab3ff 50%,#8754e9);
 box-shadow:0 0 15px #b46dff,0 3px 8px #06031388;
 cursor:grab;touch-action:none;will-change:transform;z-index:1;
}
.arcane-orb:active{cursor:grabbing}
.orb-close{position:absolute;top:2px;right:3px;width:24px;height:24px;
 border:0;border-radius:8px;background:#39224cd9;color:#f0dcff;
 font:17px system-ui;cursor:pointer;z-index:2}


.arcane-cortex{border-color:#ae83d375}
.arcane-control-label{display:flex;flex-direction:column;gap:6px;margin:10px 0;color:#e3ccf4;font-size:11px}
.arcane-control-label select{background:#21132f;color:#fff;border:1px solid #8763a8;
 border-radius:8px;padding:8px;font:12px system-ui}
.arcane-cortex .action:disabled{opacity:.45;cursor:not-allowed}


.arcane-ai-consent{
 display:flex;gap:10px;align-items:flex-start;padding:10px 12px;margin:10px 0;
 border:1px solid #9767ba66;border-radius:12px;background:#261831;
 color:#e6d8ef;font:11px/1.5 system-ui;
}
.arcane-ai-consent input{accent-color:#ac78ef;width:15px;height:15px;flex-shrink:0;margin-top:2px}


/* v0.9: conversation-first design, high contrast and carefully bounded chat. */
.panel{
 width:min(400px,calc(100vw - 20px))!important;
 background:linear-gradient(150deg,#241532 0%,#141022 72%,#0e0b17 100%)!important;
 border:1px solid #ac80df99!important;border-radius:20px!important;
 box-shadow:0 18px 52px #070310c9,0 0 0 1px #e3c4ff0a inset!important;
 backdrop-filter:none!important;max-height:min(70dvh,650px)!important;
}
.panel-header{padding:15px 17px 12px!important;background:#2b1c3a!important;border-bottom:1px solid #6f50906b}
.panel-header .row b{font:700 14px/1.3 system-ui!important;letter-spacing:.025em}
.panel-header .subtitle{font-size:11px;opacity:.9}
.tabs{background:#1d1429;padding:8px 10px!important;border-bottom:1px solid #5b3a7855}
.tab{font:600 12px/1.3 system-ui!important;border-radius:11px!important;padding:9px 10px!important;
 color:#d3bfe8!important}
.tab.selected{background:#7653a3!important;color:#fff!important;box-shadow:0 2px 10px #0905106b}
.content{
 max-height:none!important;min-height:0!important;flex:1 1 auto!important;
 padding:13px 15px 15px!important;overflow-y:auto!important;
 overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#8a62ab #1b1426;
}
.chat-history{max-height:min(290px,34dvh)!important;min-height:80px!important;
 scrollbar-width:thin;scrollbar-color:#8a62ab #1b1426}
.chat-bubble{font:12px/1.65 system-ui!important;padding:10px 12px!important;
 border-radius:14px!important}
.chat-bubble.from-familiar{background:#30203e!important;border-color:#7954a0a6!important}
.chat-bubble.from-user{background:#63408e!important;border-color:#9969ca!important}
.chat-form{gap:8px;margin-top:11px}
.chat-form input{padding:12px!important;background:#120c1d!important;border:1px solid #8963af!important;
 border-radius:12px!important;font-size:12px!important}
.chat-send{height:41px!important;min-width:42px!important;border-radius:12px!important}
.chat-suggestions button{background:#32213e!important;border-color:#76548b!important;
 color:#f4e6ff!important;font-size:11px!important;padding:7px 10px!important}
.neural-lesson{background:#21162c!important;border-color:#765b9366!important}
.thought{font:11px/1.45 system-ui!important;background:#25182feb!important;
 max-width:225px!important;border-color:#9e73be!important}
.panel .action:focus-visible,.panel button:focus-visible,.panel input:focus-visible,
.panel select:focus-visible{outline:2px solid #f2cbff;outline-offset:2px}
@media(max-width:520px){
 .panel{width:min(355px,calc(100vw - 12px))!important;max-height:min(66dvh,580px)!important}
 .panel-header{padding:12px!important}
 .content{padding:10px 12px!important}
 .chat-history{max-height:26dvh!important}
}
@media(prefers-reduced-motion:reduce){.character{animation:none!important}.character .arc-sigils{animation:none!important}}

/* Three clear tabs and an internal, unobtrusive settings disclosure. */
#arcane-skin-label select{margin-top:6px;width:100%;background:#21132f;color:#f3deff;border:1px solid #8763a8;border-radius:8px;padding:7px;font:12px system-ui}
.tabs{justify-content:stretch;gap:4px;padding:7px 8px}
.tab{flex:1 1 0;min-width:0!important;text-overflow:ellipsis;overflow:hidden;font-size:12px!important}
.arcane-advanced{margin-top:12px;padding:9px;border:1px solid #845ba353;border-radius:12px;background:#241630}
.arcane-advanced summary{font-size:11px;font-weight:600;cursor:pointer;color:#ead3f5;list-style:revert}
.arcane-advanced .actions{margin-top:10px}
.arcane-toggle{display:flex;align-items:center;gap:8px;cursor:pointer;font-size:11px;margin-top:12px;color:#e5d2f2}
.arcane-toggle input{accent-color:#ae77e4;width:15px;height:15px}
.panel,.content,.chat-history,.tabs{scrollbar-color:#8654b4 #21152e;scrollbar-width:thin}
.panel ::-webkit-scrollbar{width:8px;height:6px}
.panel ::-webkit-scrollbar-track{background:#21152e;border-radius:999px}
.panel ::-webkit-scrollbar-thumb{background:#8054ab;border:2px solid #21152e;border-radius:999px}
.panel ::-webkit-scrollbar-thumb:hover{background:#ba89df}
.arcane-skin-image{width:100%;height:100%;object-fit:contain;display:block;filter:drop-shadow(0 6px 13px #07020e88)}

@media(prefers-reduced-motion:reduce){.character,.character .eyes,.rune{animation:none!important}}
`;
const SVG = `<svg viewBox="0 0 116 150" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
<defs>
 <radialGradient id="arc-halo"><stop stop-color="#bd84ff" stop-opacity=".42"/><stop offset="1" stop-color="#8445d9" stop-opacity="0"/></radialGradient>
 <linearGradient id="arc-hat" x1=".1" y1="0" x2=".8" y2="1"><stop stop-color="#7651bd"/><stop offset=".52" stop-color="#3f246d"/><stop offset="1" stop-color="#23173c"/></linearGradient>
 <linearGradient id="arc-cloak" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6f43aa"/><stop offset=".65" stop-color="#342052"/><stop offset="1" stop-color="#170f2b"/></linearGradient>
 <linearGradient id="arc-flask" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d4ffed" stop-opacity=".8"/><stop offset=".55" stop-color="#47f5d6" stop-opacity=".7"/><stop offset="1" stop-color="#36a5ec" stop-opacity=".85"/></linearGradient>
 <filter id="arc-glow"><feGaussianBlur stdDeviation="2.1"/></filter>
</defs>
<ellipse cx="58" cy="87" rx="55" ry="60" fill="url(#arc-halo)"/>
<g class="arc-sigils" fill="none" stroke="#d5a7ff" stroke-width=".9" opacity=".68"><circle cx="58" cy="93" r="45" stroke-dasharray="3 5"/><path d="M58 40v8M58 139v-7M4 93h8M104 93h8"/><circle cx="58" cy="93" r="35" stroke-dasharray="1 10"/></g>
<ellipse cx="58" cy="143" rx="37" ry="4" fill="#0e0925" opacity=".3"/>
<!-- robe and sleeves -->
<path d="M37 93Q20 99 22 133Q38 144 58 144Q81 144 96 133Q96 101 78 94L70 89H47Z" fill="url(#arc-cloak)" stroke="#b893df" stroke-width="1.7"/>
<path d="M50 94L58 111L67 94L63 132L58 138L53 132Z" fill="#261838" stroke="#9e71c2" stroke-width="1.2"/>
<path d="M58 107l5 9-5 9-5-9Z" fill="#d7b572" stroke="#fff2bd" stroke-width=".7"/>
<path d="M36 100q-13 5-16 22" fill="none" stroke="#7952b2" stroke-width="13" stroke-linecap="round"/>
<path d="M81 102q12 3 17 18" fill="none" stroke="#7952b2" stroke-width="12" stroke-linecap="round"/>
<!-- flowing hair -->
<path d="M33 69Q23 93 36 108L44 99Q48 113 52 102L69 100Q75 111 83 107Q89 89 82 69Z" fill="#ece4f5" stroke="#b9a8d1" stroke-width="1.8"/>
<!-- face -->
<path d="M32 68Q30 47 57 48Q83 46 85 68L81 88Q75 100 59 102Q39 101 34 88Z" fill="#e9c1ad" stroke="#ba8b9a" stroke-width="1.4"/>
<ellipse cx="42" cy="85" rx="6" ry="3.3" fill="#efa5ac" opacity=".6"/><ellipse cx="74" cy="85" rx="6" ry="3.3" fill="#efa5ac" opacity=".6"/>
<!-- expressive hair fringe and eyes -->
<path d="M31 69Q37 50 51 54Q56 44 69 54Q79 52 85 69Q75 64 69 64Q64 73 58 72Q50 63 42 69Q36 67 31 71Z" fill="#f4ebff" stroke="#c9b8de" stroke-width="1.3"/>
<g class="eyes"><path d="M43 77q4-3 9 0" fill="none" stroke="#39243b" stroke-width="2" stroke-linecap="round"/><path d="M65 77q4-3 9 0" fill="none" stroke="#39243b" stroke-width="2" stroke-linecap="round"/><ellipse cx="47.5" cy="81" rx="3" ry="5" fill="#251936"/><ellipse cx="69" cy="81" rx="3" ry="5" fill="#251936"/><circle cx="48" cy="79.4" r="1.3" fill="#fff"/><circle cx="69.5" cy="79.4" r="1.3" fill="#fff"/></g>
<path class="arc-mouth" d="M54 91q4 4 8 0" fill="none" stroke="#9b6374" stroke-width="1.6" stroke-linecap="round"/>
<!-- hat with gold circlet and small arcane star -->
<path d="M18 64Q29 55 35 40Q52 13 59 5Q73 28 79 46Q88 56 97 61Q92 72 57 73Q29 72 18 64Z" fill="url(#arc-hat)" stroke="#c9a6ff" stroke-width="2.1"/>
<path d="M38 39Q55 29 76 44L80 53Q58 48 31 55Z" fill="#9a6abd" opacity=".35"/>
<path d="M22 62Q57 70 94 61" fill="none" stroke="#e3c077" stroke-width="4.5" stroke-linecap="round"/>
<path d="M56 13l3 6 7 1-5 5 2 7-7-4-6 4 1-7-5-5 7-1Z" fill="#fce1a4" stroke="#fff2c8" stroke-width="1"/>
<circle cx="59" cy="23" r="2" fill="#fff9d6"/>
<!-- alchemist vial in right hand -->
<path d="M94 111l3-7 7 2-1 7 5 10q3 12-9 15-12-2-9-14Z" fill="url(#arc-flask)" stroke="#cffdf1" stroke-width="1.5"/>
<path d="M95 110l9 3" stroke="#e8fff4" stroke-width="2"/><path d="M92 126q6 5 14 0" fill="none" stroke="#1ee4ba" stroke-width="2"/>
<circle class="potion-bubble" cx="99" cy="121" r="2.4" fill="#ecfffe"/><circle class="potion-bubble" cx="103" cy="117" r="1.2" fill="#fff"/>
<path d="M88 118q5-6 7-2" fill="none" stroke="#e7c7b9" stroke-width="5" stroke-linecap="round"/>
<!-- tiny feet and sparkles -->
<ellipse cx="44" cy="143" rx="12" ry="4" fill="#251333" stroke="#9e77bc" stroke-width="1.5"/><ellipse cx="71" cy="143" rx="12" ry="4" fill="#251333" stroke="#9e77bc" stroke-width="1.5"/>
<path class="potion-spark" d="M101 76l2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" fill="#9ff5e8"/>
<path class="potion-spark" d="M17 88l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#ffdf9a"/>
<circle cx="93" cy="53" r="2" fill="#e7d4ff"/>
</svg>`;
const MAIN_TABS=[{index:5,key:'chat'},{index:1,key:'insights'},{index:0,key:'actions'}];
const MOODS = { feliz: 'Sua magia está em alta!', animado:'Pronto para uma aventura.', meditando:'Recarregando as runas...', sonolento:'Hora de descansar.', concentrado:'Estudando feitiços...', curioso:'Explorando ideias.', tranquilo:'Seu familiar está por aqui.' };
const CONFIG_URL = typeof document==='undefined'?'':(document.currentScript?.dataset?.config||window.ALQUIMAGO_CONFIG_URL||'');
const storage=()=>{try{return window.localStorage;}catch{return null;}};
function findSameOriginLinks() {
  if (typeof document === 'undefined') return [];
  const unique = new Map();
  document.querySelectorAll('a[href]').forEach(a => {
    try {
      const url = new URL(a.getAttribute('href'), location.href);
      if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
      if (url.pathname === location.pathname && url.search === location.search && !url.hash) return;
      const key = url.pathname + url.search + url.hash;
      if (!unique.has(key)) unique.set(key, { label: (a.textContent || a.getAttribute('aria-label') || key).trim().slice(0, 68) || key, href: url.href });
    } catch { /* malformed href */ }
  });
  return [...unique.values()].slice(0, 15);
}
function auditPage() {
  const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
  return {
    title: document.title || 'Página sem título',
    path: location.pathname,
    headings: document.querySelectorAll('h1,h2,h3').length,
    buttons: document.querySelectorAll('button').length,
    links: document.querySelectorAll('a[href]').length,
    images: document.querySelectorAll('img').length,
    missingAlt: document.querySelectorAll('img:not([alt])').length,
    duplicateIds: ids.length - new Set(ids).size,
    brokenImages: [...document.images].filter(e => e.complete && e.naturalWidth === 0).length,
  };
}
class AlquimagoFamiliar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = { brain: restoreBrain(null), tab: 5, open: false, position: null };
    this.config=normalizeConfig(null);
    this.message=this.config.identity.greeting;
    this.projectFiles=[];
    this.knowledge=normalizeKnowledge(null);this.lastProjectId=null;
    this.modelAvailable=false;this.modelEnabled=false;this.modelBusy=false;this.modelSequence=0;this.modelAbort=null;
    this.links = [];
    this.audit = null;
    this.timer = null;
    this.pointerStart = null;
    this.hoverStroke=freshStroke();this.dialogue=[];
    this.neural=seedNeuralModel();this.lastUserText='';this.lastNeuralIntent='';this.pendingQuestion=null;this.configReady=false;this.lastSpoken=null;this.lastSpokenAt=0;this.lastIdleSpeech=Date.now();this.idleCycle=0;
    this.activePage=null;this.suggestions=[];this.observeTimer=null;this.observer=null;this.routeHandler=null;this.studioHandler=null;this.activityHandler=null;this.studioInfo=null;
    this.publishDialogHandler=null;
    this.language=normalizeLanguage(null);this.skin=normalizeSkin(null);this.skinAdapter=null;
    this.preferences=blankPreferences();
    this.cortex=createCortexRuntime(createCortex());this.cortexStart=Date.now();
    this.behaviorAllowed=false;this.behaviorMode='equilibrado';
    this.lastUserActivity=Date.now();this.lastAutoDecision=null;this.lastAutoFeedbackAt=0;
    this.orb=null;this.orbElement=null;this.orbField=null;this.orbFrame=0;this.orbStopAt=0;
    this.skinProfiles=[{id:'padrao',label:'Alquimago padrão',type:'svg'}];this.selectedSkin='padrao';
    this.observeProjects=true;this.hoverStart=null;this.hoverCount={};this.hoverSeen=null;
    this.pointerOverHandler=null;this.pointerOutHandler=null;this.selectedProject=null;
  }
  get desktop() { return this.getAttribute('data-mode') === 'desktop'; }
  connectedCallback() {
    const saved=readMemory(storage());
    this.dialogue=readDialogue(storage());
    this.state.brain = passTime(restoreBrain(saved.brain), Math.max(0, Date.now() - (saved.brain?.lastSeen || Date.now())));
    if (saved.position && Number.isFinite(saved.position.x) && Number.isFinite(saved.position.y)) this.state.position = saved.position;
    this.state.open = this.desktop;
    this.shadowRoot.innerHTML = `<style>${STYLE}</style><section class="shell"><div class="panel" id="panel"><header class="panel-header"><div class="row"><b id="wizard-title">✦ Grimório</b><span class="badge" id="level">Nível 1</span><button type="button" id="close-panel" aria-label="Fechar grimório" title="Fechar" class="panel-close">✕</button></div><div class="subtitle" id="wizard-subtitle">Familiar local • sem coleta de dados</div></header><nav class="tabs" id="tabs" aria-label="Seções"></nav><div class="content" id="content"></div><div class="feedback" id="feedback" role="status"></div></div><button type="button" class="thought" id="thought" aria-label="Conversar com o familiar"></button><button type="button" class="character" id="character" aria-label="Interagir com Alquimago" title="Toque para carinho, deslize para acariciar ou arraste para mover">${SVG}</button><button type="button" class="familiar-title" id="toggle"><strong id="wizard-label">✦ Alquimago</strong><small id="mood">tranquilo</small><span aria-hidden="true">⌃</span></button></section>`;
    this.$panel = this.shadowRoot.getElementById('panel');
    this.$character = this.shadowRoot.getElementById('character');
    this.$content = this.shadowRoot.getElementById('content');
    this.$thought=this.shadowRoot.getElementById('thought');
    this.$thought.addEventListener('click',()=>{this.state.open=true;this.state.tab=this.selectedProject&&Date.now()-this.lastSpokenAt<18000?1:5;this.render();});
    this.shadowRoot.getElementById('close-panel').addEventListener('click',()=>{this.state.open=false;this.render();});
    this.$tabs = this.shadowRoot.getElementById('tabs');
    this.$feedback = this.shadowRoot.getElementById('feedback');
    this.shadowRoot.getElementById('toggle').addEventListener('click', () => this.toggle());
    this.$character.addEventListener('pointerdown', e => this.onPointerDown(e));
    this.$character.addEventListener('pointermove', e => this.onPointerMove(e));
    this.$character.addEventListener('pointerleave',()=>{this.hoverStroke={...freshStroke(),lastTriggeredAt:this.hoverStroke.lastTriggeredAt};});
    this.$character.addEventListener('pointerup', e => this.onPointerUp(e));
    this.$character.addEventListener('pointercancel', () => { this.pointerStart = null; });
    this.$character.addEventListener('contextmenu',e=>{e.preventDefault();this.state.open=true;this.state.tab=0;this.render();});
    this.$character.addEventListener('wheel',e=>{
      e.preventDefault();
      const sprite=this.$character.querySelector('svg');
      if(!sprite)return;
      this.wheelAngle=(this.wheelAngle||0)+(e.deltaY>0?20:-20);
      sprite.style.transform='rotate('+this.wheelAngle+'deg)';
      clearTimeout(this.wheelTimer);
      this.wheelTimer=setTimeout(()=>{sprite.style.transform='';this.wheelAngle=0;},750);
    },{passive:false});
    this.$tabs.addEventListener('click', e => {
      const button = e.target.closest('button[data-tab]');
      if (button) { this.state.tab = Number(button.dataset.tab); this.render(); }
    });
    this.$content.addEventListener('click', e => this.onContentClick(e));
    this.$content.addEventListener('change',e=>{
      if(e.target?.id==='alquimago-skin-choice'){
        const chosen=this.skinProfiles.find(x=>x.id===e.target.value);
        if(chosen){
          this.selectedSkin=chosen.id;this.skin=normalizeSkin(chosen);this.applySkin();
          this.message='Skin "'+chosen.label+'" selecionada. '+(this.config.memory.mode==='publish'?'Publique para salvar.':'');
          this.renderHeader();
        }
      }
      if(e.target?.id==='toggle-cortex'){
        this.behaviorAllowed=!!e.target.checked;
        this.message=this.behaviorAllowed?'Iniciativas ativadas.':'Iniciativas pausadas.';
        this.renderHeader();
      }
      if(e.target?.id==='cortex-mode'){
        if(['silencioso','equilibrado','brincalhao'].includes(e.target.value)){
          this.behaviorMode=e.target.value;
          this.message='Temperamento ajustado para '+this.behaviorMode+'.';
          this.renderHeader();
        }
      }
      if(e.target?.id==='toggle-llm'){
        this.modelEnabled=this.modelAvailable&&!!e.target.checked;
        this.message=this.modelEnabled?'IA generativa ativada para esta sessão. Suas próximas perguntas poderão ser enviadas ao serviço autorizado.':'Modo contextual local ativado.';
        this.renderHeader();
      }
      if(e.target?.id==='toggle-proactive'){
        this.observeProjects=!!e.target.checked;
        if(!this.observeProjects)this.cancelProjectHover();
        this.message=this.observeProjects?'Observação de projetos ativada.':'Observação proativa pausada.';
        this.renderHeader();
      }
    });
    this.$content.addEventListener('submit',e=>{
      if(e.target?.id!=='alquimago-chat-form')return;
      e.preventDefault();
      const input=e.target.querySelector('input[name="message"]');
      if(!input)return;
      this.sendMessage(input.value);
    });
    if (!this.desktop && this.state.position) this.moveTo(this.state.position.x, this.state.position.y);
    this.render();
    this.lastSpoken=this.config.identity.greeting;this.lastSpokenAt=Date.now();this.updateThought();
    this.startObservation();
    this.studioHandler=event=>{
      const d=event?.detail;
      if(!d||typeof d.section!=='string')return;
      this.studioInfo={
        section:d.section.slice(0,35),
        projects:Number.isFinite(d.projects)?Math.max(0,Math.min(9999,d.projects)):0,
        pages:Number.isFinite(d.pages)?Math.max(0,Math.min(9999,d.pages)):0,
        editing:d.editing===true
      };
      this.inspectPage(true);
    };
    window.addEventListener('alquimago:studio-context',this.studioHandler);
    this.activityHandler=event=>{
      const data=event?.detail;
      if(data?.type==='published'&&typeof data.revision==='string'){
        this.action('publish','pub-'+encodeURIComponent(data.revision).slice(0,100));
      }
    };
    window.addEventListener('alquimago:activity',this.activityHandler);
    this.publishDialogHandler=event=>{
      if(event?.detail?.open===true){
        this.dataset.publishing='true';
        this.state.open=false;
        this.render();
      }else delete this.dataset.publishing;
    };
    window.addEventListener('alquimago:publish-dialog',this.publishDialogHandler);
    window.dispatchEvent(new Event('alquimago:request-context'));
    if(CONFIG_URL)void loadConfig(CONFIG_URL,{origin:location.origin}).then(async config=>{
      this.config=config;
      this.modelAvailable=config.llm.enabled&&!!validateModelEndpoint(config.llm.endpoint,{pageUrl:location.href});
      if(config.knowledge.file){
        try{this.knowledge=await loadKnowledge(config.knowledge.file,{pageUrl:location.href});}
        catch{this.knowledge=normalizeKnowledge(null);}
      }
      this.behaviorAllowed=config.behavior.enabled;this.behaviorMode=config.behavior.mode;
      this.observeProjects=config.proactive.projectHover;
      this.skinProfiles=config.appearance.skins;
      this.selectedSkin=config.appearance.selectedSkin;
      this.skin=normalizeSkin(this.skinProfiles.find(entry=>entry.id===this.selectedSkin)||config.appearance.skin);
      if(config.language.file){
        try{
          this.language=await loadLanguage(config.language.file,{pageUrl:location.href});
          const samples=this.language.intentSamples||{};
          for(const [intent,phrases] of Object.entries(samples)){
            if(!INTENTS.includes(intent)||!Array.isArray(phrases))continue;
            for(const example of phrases.slice(0,12))
              if(typeof example==='string'&&example.length<=120)teachNeural(this.neural,example,intent);
          }
          this.neural.learned=0;
        }catch{this.language=normalizeLanguage(null)}
      }
      this.dialogue=config.memory.mode==='publish'?[]:readDialogue(storage(),config.memory.namespace);
      this.message=config.identity.greeting;
      this.lastSpoken=config.identity.greeting;this.lastSpokenAt=Date.now();
      this.neural=config.memory.mode==='publish'?this.neural:(readNeural(storage(),config.memory.namespace)||this.neural);
      this.preferences=config.memory.mode==='publish'?blankPreferences():readPreferences(storage(),config.memory.namespace);
      let saved=config.memory.mode==='publish'?cleanMemory(null):readMemory(storage(),config.memory.namespace);
      let loadedCortex=config.memory.mode==='publish'?null:readCortex(storage(),config.memory.namespace);
      // The Studio always starts from its last published snapshot; no local drafts
      // survive a refresh unless the user explicitly publishes via GitHub.
      if(config.memory.remoteSnapshot&&(config.memory.mode==='publish'||!Object.keys(saved.brain).length)){
        const published=await readPublicSnapshot(config.memory.remoteSnapshot,{pageUrl:location.href});
        if(published?.brain&&typeof published.brain==='object'){
          saved=cleanMemory(published);
          if(published.preferences)this.preferences=cleanPreferences(published.preferences);
          if(published.behavior)loadedCortex=cleanCortex(published.behavior);
          if(published.neural){
            const restored=restoreNeuralModel(published.neural);
            if(restored)this.neural=upgradeNeuralSeed(restored);
          }
        }
      }
      if(!this.isConnected)return;
      this.configReady=true;
      this.cortex=createCortexRuntime(loadedCortex||createCortex());
      this.cortexStart=Date.now();
      this.state.brain=passTime(restoreBrain(saved.brain),Math.max(0,Date.now()-(saved.brain?.lastSeen||Date.now())));
      this.applySkin();
      if(saved.position){this.state.position=saved.position;if(!this.desktop)this.moveTo(saved.position.x,saved.position.y);}
      this.render();
    }).catch(()=>{this.message='Configuração não disponível; usando padrão seguro.';if(this.isConnected)this.renderHeader();});
    this.timer = setInterval(() => { this.state.brain = passTime(this.state.brain, 10000); this.save();this.onIdleTick(); this.renderHeader(); }, 10000);
  }
  disconnectedCallback(){
    if(this.timer)clearInterval(this.timer);
    if(this.wheelTimer)clearTimeout(this.wheelTimer);
    if(this.speechTimer)clearTimeout(this.speechTimer);
    this.modelAbort?.abort();this.modelSequence++;
    if(this.expressionTimer)clearTimeout(this.expressionTimer);
    if(this.observeTimer)clearTimeout(this.observeTimer);
    if(this.observer)this.observer.disconnect();
    if(this.routeHandler){window.removeEventListener('hashchange',this.routeHandler);window.removeEventListener('popstate',this.routeHandler);}
    if(this.studioHandler)window.removeEventListener('alquimago:studio-context',this.studioHandler);
    if(this.activityHandler)window.removeEventListener('alquimago:activity',this.activityHandler);
    if(this.publishDialogHandler)window.removeEventListener('alquimago:publish-dialog',this.publishDialogHandler);
    if(this.pointerOverHandler)document.removeEventListener('pointerover',this.pointerOverHandler);
    if(this.pointerOutHandler)document.removeEventListener('pointerout',this.pointerOutHandler);
    this.cancelProjectHover();
    if(this.skinAdapter?.dispose)this.skinAdapter.dispose();
    this.closeOrb();
    this.timer=null;this.observer=null;this.observeTimer=null;
  }
  onIdleTick(){
    if(!this.configReady||!this.isConnected)return;
    const now=Date.now(),page=this.activePage||{};
    const issues=this.suggestions.filter(x=>!['route','studio','editor'].includes(x.id));
    const active=document.activeElement;
    const typing=active instanceof Element&&!!active.closest('input,textarea,select,[contenteditable="true"]');
    const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    const info={
      route:this.desktop?'desktop':page.route||'home',
      issues:issues.length,
      hasBrokenMedia:(page.brokenImages||0)>0,
      hasAccessibilityIssue:(page.missingAlt||0)>0,
      visibleProject:!!this.selectedProject,
      working:!!this.studioInfo?.editing,
      editorVisible:!!this.studioInfo?.editing,
      panelOpen:this.state.open,
      userBusy:typing||now-this.lastUserActivity<25000,
      idleSeconds:(now-this.lastUserActivity)/1000,
      hidden:document.hidden,
      reducedMotion:reduced,
      playful:this.behaviorMode==='brincalhao',
      quiet:this.behaviorMode==='silencioso',
      brain:this.state.brain,
      enabled:this.behaviorAllowed&&now-this.cortexStart>45000,
      cooldownMs:this.config.behavior.minIntervalMs,
      dailyLimit:this.config.behavior.maxPerDay
    };
    const outcome=tickCortex(this.cortex,info,now);
    if(!outcome.action)return;
    const action=outcome.action;
    const topic=issues[0]?.title||'a apresentação do projeto';
    const lines={
      dica:'Percebi algo sobre '+topic+'. Posso mostrar uma sugestão.',
      observar:'Estou observando a estrutura pública desta página.',
      investigar:'Esta seção tem detalhes que podemos explorar juntos.',
      acenar:'Saudações do seu familiar arcano! ✧',
      brilhar:'Uma pequena runa se acendeu. ✦',
      brincar:'Que tal brincar com o orbe arcano?',
      meditar:'Vou recuperar um pouco de energia arcana.',
      celebrar:'Uma etapa concluída merece uma pequena celebração. ✦',
      curiosidade:'Encontrei uma ideia que vale investigar.',
      pensar:'Tenho algumas alternativas para a próxima melhoria.',
      estudar:'Vou observar o que já está apresentado publicamente.',
      poção:'Uma poção de criatividade está borbulhando. ⚗',
      alongar:'Uma pequena pausa entre projetos pode ser interessante.',
      descansar:'Vou repousar um instante.',
      acolher:'Se precisar, estou por aqui para sugerir melhorias.'
    };
    this.lastAutoDecision={action,context:info.route,at:now,used:false};
    if(['dica','brincar'].includes(action))
      this.pendingQuestion={kind:action==='brincar'?'play':'page-insight',at:now};
    this.lastSpoken=lines[action]||outcome.reason||'Um novo pensamento arcano.';
    this.lastSpokenAt=now;
    this.message=this.lastSpoken;
    this.updateThought();
    this.save();
  }
  closeOrb(){
    if(this.orbFrame)cancelAnimationFrame(this.orbFrame);
    this.orbFrame=0;this.orbState=null;
    if(this.orbField)this.orbField.remove();
    this.orbField=null;this.orbElement=null;
  }
  startOrb(){
    if(this.orbField){this.closeOrb();return;}
    if(!this.config.behavior.toy)return;
    const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    const field=document.createElement('div');field.className='arcane-orb-field';
    field.setAttribute('aria-label','Área de brincadeira do orbe arcano');
    const ball=document.createElement('button');ball.type='button';
    ball.className='arcane-orb';ball.setAttribute('aria-label','Arremessar o orbe arcano');
    ball.textContent='✦';
    const close=document.createElement('button');close.type='button';
    close.className='orb-close';close.textContent='×';close.setAttribute('aria-label','Guardar orbe');
    close.addEventListener('click',()=>this.closeOrb());
    field.append(ball,close);this.shadowRoot.querySelector('.shell').appendChild(field);
    this.orbField=field;this.orbElement=ball;this.orbState=createOrb();
    this.orbStopAt=performance.now()+20000;
    const render=()=>{if(this.orbElement&&this.orbState)
      this.orbElement.style.transform='translate('+Math.round(this.orbState.x-11)+'px,'+
      Math.round(this.orbState.y-11)+'px)';};
    render();
    let down=null;
    ball.addEventListener('pointerdown',e=>{
      e.preventDefault();e.stopPropagation();
      ball.setPointerCapture(e.pointerId);
      const rect=field.getBoundingClientRect();
      down={x:e.clientX,y:e.clientY,t:performance.now(),rect};
    });
    ball.addEventListener('pointermove',e=>{
      if(!down||!this.orbState)return;
      e.preventDefault();e.stopPropagation();
      this.orbState.x=Math.max(this.orbState.radius,Math.min(165-this.orbState.radius,e.clientX-down.rect.left));
      this.orbState.y=Math.max(this.orbState.radius,Math.min(112-this.orbState.radius,e.clientY-down.rect.top));
      render();
    });
    ball.addEventListener('pointercancel',()=>{down=null;});
    ball.addEventListener('pointerup',e=>{
      e.preventDefault();e.stopPropagation();
      if(down&&this.orbState){
        const elapsed=Math.max(40,performance.now()-down.t);
        const velocityX=(e.clientX-down.x)/elapsed*18;
        const velocityY=(e.clientY-down.y)/elapsed*18;
        this.orbState=tossOrb(this.orbState,
          Math.abs(velocityX)<.5?4:velocityX,
          Math.abs(velocityY)<.5?-7:velocityY);
        this.orbStopAt=performance.now()+18000;
      }
      down=null;
    });
    let previous=performance.now();
    const frame=now=>{
      if(!this.orbField||!this.isConnected)return;
      if(now>=this.orbStopAt){this.closeOrb();return;}
      if(!document.hidden&&!reduced&&!down){
        const dt=Math.min(2,(now-previous)/16.667);
        this.orbState=stepOrb(this.orbState,165,112,dt);
        render();
      }
      previous=now;this.orbFrame=requestAnimationFrame(frame);
    };
    this.orbFrame=requestAnimationFrame(frame);
    this.message='Orbe arcano invocado! Arraste e solte para arremessar.';
    this.renderHeader();
  }
  applySkin(){
    const skin=this.skin||normalizeSkin(null);
    const url=skin.src?safeSkinUrl(skin,location.href):null;
    if(this.skinAdapter?.dispose){try{this.skinAdapter.dispose()}catch{/* optional renderer */}}
    this.skinAdapter=null;
    this.$character.replaceChildren();
    if(skin.type==='image'&&url){
      const img=document.createElement('img');
      img.src=url;img.alt='';
      img.className='arcane-skin-image';
      img.decoding='async';
      this.$character.appendChild(img);
      return;
    }
    if(skin.type==='model3d'&&url){
      // The host (React/desktop) may register a Three.js renderer that accepts
      // glTF/GLB and uses named morph targets. No library is loaded implicitly.
      const adapter=window.AlquimagoSkinRenderers?.model3d;
      if(typeof adapter==='function'){
        try{
          const instance=adapter({host:this.$character,url,shapeKeys:skin.shapeKeys});
          if(instance&&typeof instance==='object')this.skinAdapter=instance;
          return;
        }catch{/* fall back to built-in SVG */ }
      }
    }
    this.$character.innerHTML=SVG;
  }
  projectPointerOver(e){
    if(this.desktop||!this.observeProjects||!this.config.features.pageAudit)return;
    const target=e.target;
    if(!(target instanceof Element))return;
    const card=target.closest('[data-alquimago-project]');
    if(!card||card===this.hoverSeen)return;
    if(card.closest('alquimago-familiar')||target.closest('input,textarea,[contenteditable="true"]'))return;
    this.cancelProjectHover();
    const meta=projectMeta(card);
    if(!meta)return;
    this.lastUserActivity=Date.now();
    const key=projectIdentity(meta);
    if(!shouldCommentProject(this.hoverCount,key,Date.now(),{cooldownMs:this.config.proactive.cooldownMs}))return;
    this.hoverSeen=card;
    this.hoverStart=setTimeout(async()=>{
      this.hoverStart=null;
      if(!this.isConnected||!card.isConnected||document.hidden||!this.observeProjects)return;
      const advice=projectAdvice(meta);if(!advice)return;
      const cover=card.querySelector('img');
      if(cover){
        const metrics=await inspectCover(cover,{pageUrl:location.href});
        if(metrics){
          advice.metrics=metrics;
          advice.tips=[...new Set([imageMetricAdvice(metrics),...advice.tips])].slice(0,4);
          advice.comment+=' '+imageMetricAdvice(metrics);
          advice.disclaimer='Observações de cor/luz por amostragem local e metadados; não há reconhecimento semântico de objetos.';
        }
      }
      if(!this.isConnected||!card.isConnected)return;
      advice.orderedTips=rankTips(advice.tips,advice.category,this.preferences);
      this.selectedProject=advice;
      this.hoverCount[key]=Date.now();
      this.lastSpoken=advice.comment;
      this.lastSpokenAt=Date.now();
      this.message='Dica sobre '+advice.title;
      this.updateThought();
      if(this.state.open&&this.state.tab===1)this.render();
    },this.config.proactive.delayMs);
  }
  cancelProjectHover(){
    if(this.hoverStart){clearTimeout(this.hoverStart);this.hoverStart=null;}
    this.hoverSeen=null;
  }
  projectPointerOut(e){
    if(!(e.target instanceof Element))return;
    const card=e.target.closest('[data-alquimago-project]');
    if(card&&card===this.hoverSeen&&!card.contains(e.relatedTarget))this.cancelProjectHover();
  }
  startObservation(){
    if(this.desktop||!this.isConnected)return;
    this.routeHandler=()=>this.inspectPage(true);
    this.pointerOverHandler=e=>this.projectPointerOver(e);
    this.pointerOutHandler=e=>this.projectPointerOut(e);
    document.addEventListener('pointerover',this.pointerOverHandler,{passive:true});
    document.addEventListener('pointerout',this.pointerOutHandler,{passive:true});
    window.addEventListener('hashchange',this.routeHandler);
    window.addEventListener('popstate',this.routeHandler);
    if(typeof MutationObserver!=='undefined'){
      this.observer=new MutationObserver(()=>{
        if(this.observeTimer)return;
        this.observeTimer=setTimeout(()=>{this.observeTimer=null;this.inspectPage(false);},1400);
      });
      this.observer.observe(document.body,{childList:true,subtree:true});
    }
    this.inspectPage(true);
  }
  inspectPage(navigated=false){
    if(this.desktop||!this.isConnected)return;
    const next=readPublicPage(document,location.href);
    if(!navigated&&samePageSignature(next,this.activePage))return;
    const routeChanged=this.activePage?.signature!==next.signature;
    this.activePage=next;
    this.audit=auditPage();
    this.suggestions=suggestionsFromPage(next);
    if(this.studioInfo?.editing){
      this.suggestions.unshift({
        id:'studio',title:'Studio • '+this.studioInfo.section,
        description:'Projeto em edição com '+this.studioInfo.projects+' projetos e '+this.studioInfo.pages+' páginas personalizadas. Revise a prévia antes da publicação.'
      });
      this.suggestions=this.suggestions.slice(0,6);
    }
    if(routeChanged){
      this.message='Reconheci a página: '+next.route+'. Tenho '+this.suggestions.length+' sugestão(ões).';
    }
    this.updateThought();
    if(this.state.open&&this.state.tab===1)this.render();
    else this.renderHeader();
  }
  updateThought(){
    if(!this.$thought)return;
    const tip=this.suggestions.find(x=>!['route','editor'].includes(x.id))||this.suggestions[0];
    const spoken=this.lastSpoken&&Date.now()-this.lastSpokenAt<14500?this.lastSpoken:null;
    this.$thought.textContent=spoken?spoken.slice(0,90):tip?'✦ '+tip.title:'';
    this.$thought.hidden=!!this.state.open&&this.state.tab===5||(!spoken&&!tip);
  }
  save(){
    if(this.config.memory.mode==='publish')return;
    writeMemory(storage(),{brain:this.state.brain,position:this.state.position},this.config.memory.namespace);
    writeCortex(storage(),this.config.memory.namespace,this.cortex.state);
  }
  snapshot(){return this.configReady?{...JSON.parse(exportBackup({brain:this.state.brain,position:this.state.position})),neural:serializeNeuralModel(this.neural),preferences:cleanPreferences(this.preferences),behavior:cleanCortex(this.cortex.state),selectedSkin:this.selectedSkin}:null;}
  moveTo(x, y) {
    const maxX = Math.max(0, innerWidth - 125), maxY = Math.max(0, innerHeight - 166);
    const left = Math.max(0, Math.min(maxX, x)), top = Math.max(0, Math.min(maxY, y));
    this.style.left = left + 'px'; this.style.top = top + 'px'; this.style.right = 'auto'; this.style.bottom = 'auto';
    this.state.position = { x: left, y: top };
  }
  onPointerDown(e) {
    if (e.button !== 0) return;
    this.lastUserActivity=Date.now();
    const box=this.getBoundingClientRect();
    this.pointerStart={x:e.clientX,y:e.clientY,left:box.left,top:box.top,dx:0,dy:0,moved:false};
    if(this.desktop&&e.altKey){
      try{void window.__TAURI__?.window?.getCurrentWindow()?.startDragging();}catch{/* platform optional */}
    }
    this.$character.setPointerCapture(e.pointerId);
  }
  onPointerMove(e) {
    if(!this.pointerStart){
      if(e.pointerType==='mouse'&&e.buttons===0){
        const rect=this.$character.getBoundingClientRect();
        const result=updateHeadStroke(this.hoverStroke,{
          x:e.clientX-rect.left,
          head:e.clientY-rect.top<rect.height*.71,
          pressed:false,
          time:Date.now()
        });
        this.hoverStroke=result.state;
        if(result.triggered){this.action('stroke');this.spawnAffection();}
      }
      return;
    }
    const dx=e.clientX-this.pointerStart.x,dy=e.clientY-this.pointerStart.y;
    this.pointerStart.dx=dx;this.pointerStart.dy=dy;
    // Short strokes are caresses. Intentional longer drags relocate the mascot.
    if(this.config.features.dragging&&Math.hypot(dx,dy)>72)this.pointerStart.moved=true;
    if(this.pointerStart.moved&&!this.desktop)this.moveTo(this.pointerStart.left+dx,this.pointerStart.top+dy);
  }
  onPointerUp(e) {
    const data = this.pointerStart; this.pointerStart = null;
    if (!data) return;
    if(data.moved){if(!this.desktop)this.save();}
    else if(Math.abs(data.dx)>13&&Math.abs(data.dx)<72&&Math.abs(data.dy)<58){this.action('stroke');this.spawnAffection();}
    else {this.action('pet');this.spawnAffection();if(!this.desktop){this.state.tab=5;this.state.open=true;this.render();}}
    if (this.$character.hasPointerCapture(e.pointerId)) this.$character.releasePointerCapture(e.pointerId);
  }
  spawnAffection(){
    const node=document.createElement('span');
    node.className='affection-burst';node.textContent='♥ ✦ ♥';
    this.$character.appendChild(node);
    setTimeout(()=>node.remove(),950);
  }
  sendMessage(text){
    this.lastUserActivity=Date.now();
    const user=safeChatText(text);
    if(!user)return;
    const command=recognizeStudioCommand(user,this.config.commands.publishPhrase);
    if(command==='prepare-publish'){
      // Only an explicit submit inside the familiar can request the existing
      // publisher. The phrase is never an authentication factor or approval.
      const allowed=!this.desktop&&this.config.memory.mode==='publish'&&this.studioInfo?.editing===true;
      const reply=allowed?
        'Encontrei o comando! ⚗ Vou abrir a revisão da publicação. Confira as alterações e confirme no Studio. A frase não substitui sua autorização GitHub.':
        'Esse comando está disponível apenas no Local Studio desbloqueado. Ele não publica sozinho.';
      this.dialogue=[...this.dialogue,{role:'user',text:user},{role:'familiar',text:reply}].slice(-24);
      this.lastUserText='';this.lastNeuralIntent='';this.pendingQuestion=null;
      this.message=reply;this.lastSpoken=reply;this.lastSpokenAt=Date.now();
      this.state.tab=5;this.state.open=true;this.render();
      if(allowed)window.dispatchEvent(new CustomEvent('alquimago:request-publish',{
        detail:{source:'chat',action:'review-only'}
      }));
      return;
    }
    const prediction=neuralPredict(this.neural,user);
    this.lastUserText=user;this.lastNeuralIntent=prediction.intent;
    const response=respondToChat(user,{
      pending:this.pendingQuestion,
      knowledge:this.knowledge,lastProjectId:this.lastProjectId,
      focusTitle:this.selectedProject?.title||'',
      neuralIntent:prediction.confidence>=.55?prediction.intent:null,
      name:this.config.identity.name,mood:currentMood(this.state.brain),
      level:levelFromXp(this.state.brain.xp),xp:this.state.brain.xp,
      page:this.activePage?.route||'desktop',suggestions:this.suggestions
    });
    const canGenerate=this.modelAvailable&&this.modelEnabled&&!this.modelBusy&&
      !['private','math','followup','decline','clarify','navigate','empty','project-fact','project-list','project-info'].includes(response.intent)&&
      user.length>=3;
    if(canGenerate){
      const history=this.dialogue.slice(-8);
      const project=this.knowledge.projects.find(p=>p.id===(response.projectId||this.lastProjectId))||null;
      const request=++this.modelSequence;
      this.modelBusy=true;
      this.pendingQuestion=null;
      this.lastUserText='';this.lastNeuralIntent='';
      this.dialogue=[...this.dialogue,{role:'user',text:user},
        {role:'familiar',text:'Consultando o modelo de linguagem…'}].slice(-24);
      this.state.tab=5;this.state.open=true;this.render();
      this.modelAbort?.abort();
      const controller=new AbortController();this.modelAbort=controller;
      const timer=setTimeout(()=>controller.abort(),18000);
      void askLanguageModel({
        endpoint:this.config.llm.endpoint,prompt:user,history,project,
        pageUrl:location.href,signal:controller.signal
      }).then(answer=>{
        if(!this.isConnected||request!==this.modelSequence)return;
        this.dialogue[this.dialogue.length-1]={role:'familiar',text:answer.reply};
        this.message=answer.reply;
        this.lastSpoken=answer.reply;this.lastSpokenAt=Date.now();
      }).catch(error=>{
        if(!this.isConnected||request!==this.modelSequence)return;
        const reason=error?.name==='AbortError'?
         'A consulta demorou demais.':error instanceof Error?error.message:'Não consegui conectar à IA.';
        const fallback=reason+' Resposta local: '+response.reply;
        this.dialogue[this.dialogue.length-1]={role:'familiar',text:fallback};
        this.message=fallback;
      }).finally(()=>{
        clearTimeout(timer);
        if(request===this.modelSequence&&this.isConnected){
          this.modelBusy=false;this.render();
          const log=this.$content.querySelector('.chat-history');
          if(log)log.scrollTop=log.scrollHeight;
        }
      });
      return;
    }
    this.pendingQuestion=pendingFromReply(response);
    if(response.projectId)this.lastProjectId=response.projectId;
    if(['math','followup','decline','clarify'].includes(response.intent)){
      this.lastUserText='';this.lastNeuralIntent='';
    }
    if(response.store!==false&&response.intent!=='empty'&&typeof this.language.responses?.[response.intent]==='string'){
      response.reply=this.language.responses[response.intent].replace(/\{(name|xp|page|level)\}/g,(_,key)=>({
        name:this.config.identity.name,xp:String(this.state.brain.xp),
        page:this.activePage?.route||'desktop',level:String(levelFromXp(this.state.brain.xp))
      })[key]||'');
    }
    if(response.action)this.action(response.action);
    let destination=null;
    if(response.intent==='navigate'&&!this.desktop){
      const names={galeria:'portfolio',portfolio:'portfolio',contato:'contato',sobre:'sobre',inicio:'inicio',home:'inicio'};
      const hash=names[response.target];
      const options=findSameOriginLinks();
      destination=options.find(link=>new URL(link.href).hash.toLowerCase().includes('/'+hash))||null;
      response.reply=destination?'Encontrei '+response.target+'. Abrindo esta seção do site…':'Não encontrei '+response.target+' na navegação disponível. Você pode conferir a aba Rotas.';
    }
    if(response.store===false){this.lastUserText='';this.lastNeuralIntent='';}
    if(response.store!==false){
      this.dialogue=[...this.dialogue,{role:'user',text:user},{role:'familiar',text:response.reply}].slice(-24);
      if(this.config.memory.mode!=='publish')writeDialogue(storage(),this.config.memory.namespace,this.dialogue);
    }else{
      this.dialogue=[...this.dialogue,{role:'familiar',text:response.reply}].slice(-24);
    }
    this.message=response.reply;
    this.lastSpoken=response.reply;this.lastSpokenAt=Date.now();
    if(this.skinAdapter?.setExpression){
      this.skinAdapter.setExpression('talk');
      clearTimeout(this.speechTimer);
      this.speechTimer=setTimeout(()=>this.skinAdapter?.setExpression(skinExpression(currentMood(this.state.brain))),850);
    }
    this.state.tab=5;this.state.open=true;this.render();
    const log=this.$content.querySelector('.chat-history');
    if(log)log.scrollTop=log.scrollHeight;
    this.$content.querySelector('input[name="message"]')?.focus();
    if(destination&&new URL(destination.href).origin===location.origin)location.assign(destination.href);
  }
    action(name,detail=''){
    this.lastUserActivity=Date.now();
    const before=this.state.brain.xp;
    const pageKey=name==='explore'?encodeURIComponent(routeSignature(location.href)).slice(0,120):name==='publish'?detail:'';
    this.state.brain=applyAction(this.state.brain,name,Date.now(),pageKey);
    const earned=this.state.brain.xp-before;
    const messages={stroke:'Hmm… mais um carinho no chapéu! ✧',brew:'Elixir alquímico preparado! ✨',explore:'Nova rota estudada. ✦',publish:'Projeto publicado! Magia de verdade. ✦'};
    this.message=(this.config.messages[name]||messages[name]||'Runas reorganizadas.')+(earned?' +'+earned+' XP':'');
    this.save();this.render();
    if(['pet','stroke'].includes(name)&&this.skinAdapter?.setExpression){
      this.skinAdapter.setExpression('pet');
      clearTimeout(this.expressionTimer);
      this.expressionTimer=setTimeout(()=>this.skinAdapter?.setExpression(skinExpression(currentMood(this.state.brain))),900);
    }
  }
  toggle() { if (this.desktop) return; this.state.open = !this.state.open; this.render(); }
  renderHeader() {
    const mood=currentMood(this.state.brain);
    this.shadowRoot.getElementById('wizard-title').textContent='✦ '+this.config.identity.name+' · v0.9';
    this.shadowRoot.getElementById('wizard-label').textContent='✦ '+this.config.identity.name;
    this.shadowRoot.getElementById('wizard-subtitle').textContent=this.config.identity.subtitle+(this.config.memory.mode==='publish'?' · rascunho até publicar':'');
    this.style.setProperty('--violet',this.config.appearance.accent);
    this.style.setProperty('--gold',this.config.appearance.gold);
    this.shadowRoot.getElementById('mood').textContent = mood;
    this.shadowRoot.getElementById('level').textContent = `Nível ${levelFromXp(this.state.brain.xp)}`;
    this.$character.dataset.mood = mood;
    if(this.skinAdapter?.setExpression){try{this.skinAdapter.setExpression(skinExpression(mood))}catch{/* optional 3D adapter */}}
    this.$feedback.textContent = this.message || MOODS[mood];
    this.updateThought();
  }
  render() {
    const flags=this.config.features;
    const allowed=[flags.actions,flags.pageAudit,flags.routes,flags.projectFiles,flags.assistants,flags.dialogue];
    if(!allowed[this.state.tab])this.state.tab=[5,1,0].find(index=>allowed[index])??0;
    this.setAttribute('data-position',this.config.appearance.position);
    this.$panel.classList.toggle('open', this.state.open);
    this.renderHeader();
    this.$tabs.replaceChildren();
    for(const item of MAIN_TABS.filter(item=>allowed[item.index])){
      const button=document.createElement('button');
      button.type='button';
      button.className='tab'+(item.index===this.state.tab?' selected':'');
      button.dataset.tab=String(item.index);
      button.setAttribute('aria-pressed',String(item.index===this.state.tab));
      button.textContent=this.language.tabs[item.key]||item.key;
      this.$tabs.appendChild(button);
    }
    this.$content.replaceChildren();
    const add = (html) => { const node = document.createElement('div'); node.innerHTML = html; this.$content.appendChild(node); return node; };
    if (this.state.tab === 0) {
      const b = this.state.brain;
      add(`<div class="line"><span>Energia mágica</span><small>${Math.round(b.energy)}%</small></div><div class="stat"><div class="bar" style="width:${b.energy}%"></div></div><div class="line"><span>Curiosidade</span><small>${Math.round(b.curiosity)}%</small></div><div class="stat"><div class="bar" style="width:${b.curiosity}%"></div></div><div class="line"><span>Foco</span><small>${Math.round(b.focus)}%</small></div><div class="stat"><div class="bar" style="width:${b.focus}%"></div></div><div class="muted">${b.interactions} interações • ${b.xp} XP</div><p class="muted">Arraste o dedo suavemente sobre o personagem para fazer carinho; arraste mais longe para movê-lo. Carinhos não geram XP infinito.</p><div class="actions"><button class="action" data-action="pet">♡ Carinho</button><button class="action" data-action="play">✧ Brincar</button><button class="action" data-action="brew">⚗ Poção</button><button class="action" data-action="focus">◈ Foco</button><button class="action" data-action="rest">☾ Meditar</button><button class="action" data-action="orb-toy">◉ Orbe arcano</button></div>
      <details class="arcane-advanced arcane-cortex">
      <summary>🧠 Cérebro e autonomia</summary>
      <p class="muted" id="cortex-summary">Rede pulsada local, com decisões e memória comportamental.</p>
      <label class="arcane-toggle"><input type="checkbox" id="toggle-cortex"> Permitir iniciativas discretas</label>
      <label class="arcane-control-label">Temperamento
        <select id="cortex-mode"><option value="silencioso">Silencioso</option><option value="equilibrado">Equilibrado</option><option value="brincalhao">Brincalhão</option></select>
      </label>
      <p class="muted" id="cortex-last">Nenhuma iniciativa recente.</p>
      <div class="actions"><button class="action" data-action="cortex-like">✓ Gostei</button>
      <button class="action" data-action="cortex-dislike">✕ Menos disso</button></div>
      <p class="muted">Sem controlar navegação, publicação ou campos do site. Pausado quando há interação ativa.</p>
      </details><details class="arcane-advanced"><summary>⚙ Ajustes e ferramentas</summary>
      <div class="actions"><button class="action" data-action="go-routes">Rotas internas</button>
      <button class="action" data-action="go-files">Arquivos públicos</button>
      <button class="action" data-action="go-ai">Continuar com IA</button></div>
      <label class="arcane-toggle"><input type="checkbox" id="toggle-proactive"> Comentários proativos em projetos</label>
      <div class="actions"><button class="action" data-action="export-memory">Exportar memória</button>
      <button class="action" data-action="import-memory">Restaurar</button>
      <button class="action" data-action="reset-memory">Zerar dados</button></div>
      <div class="muted">Aparência: <span id="arcane-skin-label"></span></div>
      </details>`);if(this.config.memory.mode==='publish')add('<div class="session-note">Estas mudanças só serão mantidas se você publicar. <button type="button" class="action primary" data-action="open-publish">Publicar alterações</button> Recarregar descarta o rascunho.</div>');
    } else if (this.state.tab === 1) {
      if (this.desktop) add('<p class="muted">No desktop, o familiar não lê outras janelas. A leitura de projetos será um módulo futuro com permissão explícita.</p>');
      else {
        this.audit=auditPage();
        const a = this.audit;
        const wrapper = add(`<div class="line"><b>Diagnóstico superficial</b></div><div class="muted" id="page-title"></div><div class="line"><span>Elementos de navegação</span><b>${a.links}</b></div><div class="line"><span>Botões</span><b>${a.buttons}</b></div><div class="line"><span>Imagens sem atributo alt</span><b>${a.missingAlt}</b></div><div class="line"><span>IDs duplicados</span><b>${a.duplicateIds}</b></div><div class="line"><span>Imagens com falha</span><b>${a.brokenImages}</b></div><div class="actions"><button class="action" data-action="audit">↻ Atualizar</button><button class="action primary" data-action="copy-audit">Copiar relatório</button></div>`);
        wrapper.querySelector('#page-title').textContent=a.title;
        const intro=document.createElement('p');intro.className='muted';intro.textContent='Análise contextual: somente estrutura da página e rota atual, nunca valores digitados ou mensagens.';this.$content.appendChild(intro);
        if(this.selectedProject){
          const tip=this.selectedProject;
          const card=document.createElement('section');card.className='insight';
          const heading=document.createElement('b');heading.textContent='✦ '+tip.label;
          const explanation=document.createElement('p');explanation.textContent=tip.comment;
          const details=document.createElement('p');details.className='muted';details.textContent=tip.disclaimer;
          card.append(heading,explanation,details);
          for(const point of (tip.orderedTips||rankTips(tip.tips,tip.category,this.preferences)).slice(0,3)){
            const row=document.createElement('p');row.className='muted';row.textContent='• '+point.text;card.appendChild(row);
          }
          const actions=document.createElement('div');actions.className='actions';
          for(const [useful,label] of [[true,'✓ Dica útil'],[false,'✕ Não priorizar']] ){
            const rate=document.createElement('button');rate.type='button';rate.className='action';
            rate.dataset.tipFeedback=useful?'yes':'no';
            rate.dataset.tipIndex=String((tip.orderedTips||rankTips(tip.tips,tip.category,this.preferences))[0]?.index??0);
            rate.textContent=label;actions.appendChild(rate);
          }
          card.appendChild(actions);
          const copy=document.createElement('button');copy.className='action';copy.type='button';
          copy.dataset.action='copy-project-advice';copy.textContent=this.language.ui.copy;
          card.appendChild(copy);
          this.$content.appendChild(card);
        }
        const title=document.createElement('div');title.className='line';title.innerHTML='<b>Sugestões do familiar</b>';this.$content.appendChild(title);
        for(const [i,tip] of this.suggestions.entries()){
          const box=document.createElement('div');box.className='insight';
          const heading=document.createElement('b');heading.textContent='✦ '+tip.title;
          const detail=document.createElement('span');detail.textContent=tip.description;
          const copy=document.createElement('button');copy.type='button';copy.className='action';copy.dataset.insight=String(i);copy.textContent='Pedir ajuda à IA ↗';copy.style.marginTop='7px';
          box.append(heading,detail,document.createElement('br'),copy);this.$content.appendChild(box);
        }
        const explore=document.createElement('button');explore.type='button';explore.className='action primary';explore.dataset.action='explore';explore.textContent='✧ Explorar esta rota';this.$content.appendChild(explore);
      }
    } else if (this.state.tab === 2) {
      add('<button type="button" class="action" data-action="go-actions">← Voltar às interações</button>');
      if (this.desktop) add('<p class="muted">Abra a versão web do Alquimago no seu projeto React para navegar pelas páginas desse site.</p>');
      else {
        this.links = findSameOriginLinks();
        add(`<p class="muted">Rotas do site atual. A navegação será feita somente quando você escolher.</p>`);
        if (!this.links.length) add('<p>Nenhuma outra rota encontrada.</p>');
        this.links.forEach((link, i) => {
          const button = document.createElement('button'); button.type = 'button'; button.className = 'list-item'; button.dataset.navigate = String(i);
          button.textContent = link.label || link.href;
          button.title = link.href;
          this.$content.appendChild(button);
        });
      }
    } else if(this.state.tab===3){
      add('<button type="button" class="action" data-action="go-actions">← Voltar às interações</button>');
      if(this.desktop)add('<p class="muted">Escolha uma pasta para analisar textos autorizados. Nenhuma pasta é lida automaticamente.</p><div class="actions"><button class="action primary" data-action="choose-folder">Escolher pasta</button></div>');
      else add('<p class="muted">Só os arquivos públicos listados na configuração do projeto são acessados.</p><div class="actions"><button class="action primary" data-action="read-files">Ler arquivos</button></div>');
      if(!this.projectFiles.length)add('<p class="muted">Nenhum arquivo examinado ainda.</p>');
      for(const entry of this.projectFiles){
        const item=document.createElement('div');item.className='line';
        const label=document.createElement('span');label.textContent=entry.file.slice(0,75);
        const result=document.createElement('small');result.textContent=entry.status==='read'?String(entry.bytes)+' bytes':entry.status;
        item.append(label,result);this.$content.appendChild(item);
      }
    } else if(this.state.tab===4){
      add('<button type="button" class="action" data-action="go-actions">← Voltar às interações</button>');
      add('<p class="muted">Para questões que ultrapassem meu diálogo local, posso preparar um resumo e abrir ChatGPT ou Gemini, sempre por escolha do usuário.</p><div class="actions"><button class="action primary" data-action="chatgpt">ChatGPT ↗</button><button class="action" data-action="gemini">Gemini ↗</button></div>');
    } else if(this.state.tab===5){
      const history=document.createElement('div');
      history.className='chat-history';
      history.setAttribute('role','log');
      history.setAttribute('aria-label','Diálogo local');
      const lines=this.dialogue.length?this.dialogue:[{role:'familiar',text:this.config.identity.greeting}];
      for(const item of lines){
        const bubble=document.createElement('div');
        bubble.className='chat-bubble '+(item.role==='user'?'from-user':'from-familiar');
        bubble.textContent=item.text;
        history.appendChild(bubble);
      }
      this.$content.appendChild(history);
      add('<form id="alquimago-chat-form" class="chat-form" autocomplete="off"><label for="alquimago-message" class="sr-only">Mensagem para o familiar</label><input name="message" id="alquimago-message" maxlength="320" placeholder="Converse com seu familiar..." aria-label="Sua mensagem" required><button type="submit" class="chat-send" aria-label="Enviar mensagem">➤</button></form>');
      if(this.pendingQuestion&&Date.now()-this.pendingQuestion.at<300000){
        add('<div class="chat-suggestions" aria-label="Responder à pergunta"><button type="button" data-say="sim">✓ Sim</button><button type="button" data-say="não">✕ Não</button></div>');
      }else{
        add('<div class="chat-suggestions"><button type="button" data-say="OIE!">Olá</button><button type="button" data-say="Como faço carinho?">Carinho</button><button type="button" data-say="Quanto XP tenho?">XP</button><button type="button" data-say="Quanto é 2 + 2?">Matemática</button></div>');
      }
      const teacher=document.createElement('div');teacher.className='neural-teach';
      const lbl=document.createElement('label');lbl.textContent='Ensinar o significado da última mensagem:';
      const chooser=document.createElement('select');chooser.id='alquimago-teach';
      const intentLabels={greeting:'Saudação',identity:'Identidade',status:'XP e status',pet:'Carinho',play:'Brincar',brew:'Poção',rest:'Descanso',navigate:'Navegação',insight:'Sugestão',help:'Ajuda',mood:'Humor',thanks:'Agradecimento'};
      for(const intent of INTENTS){
        const option=document.createElement('option');option.value=intent;option.textContent=this.language.intentLabels?.[intent]||intentLabels[intent]||intent;
        option.selected=intent===this.lastNeuralIntent;chooser.appendChild(option);
      }
      const teach=document.createElement('button');teach.type='button';teach.dataset.action='teach-neural';teach.textContent='Ensinar';
      teach.disabled=!this.lastUserText;
      teacher.append(lbl,chooser,teach);
      const lesson=document.createElement('details');lesson.className='neural-lesson';
      const summary=document.createElement('summary');summary.textContent='✦ Ensinar a reconhecer uma frase';
      lesson.append(summary,teacher);this.$content.appendChild(lesson);
      if(this.modelAvailable){
        const consent=document.createElement('label');
        consent.className='arcane-ai-consent';
        const choice=document.createElement('input');choice.type='checkbox';
        choice.id='toggle-llm';choice.checked=this.modelEnabled;
        choice.disabled=this.modelBusy;
        const details=document.createElement('span');
        details.textContent='Usar IA generativa (opcional). Cada nova pergunta poderá ser enviada ao serviço configurado. Não envie dados privados.';
        consent.append(choice,details);
        this.$content.appendChild(consent);
      }
      const message=document.createElement('p');message.className='muted';
      message.textContent='Modo '+(this.modelEnabled?'IA generativa':'contextual local')+' · '+this.knowledge.projects.length+' obras públicas conhecidas · '+this.neural.learned+' correções de frases.';
      this.$content.appendChild(message);
      if(this.config.memory.mode==='publish')add('<div class="session-note">As conversas e mudanças de XP são temporárias. Clique em Publicar no Studio para salvar; recarregar descarta o que não foi publicado.</div>');
      history.scrollTop=history.scrollHeight;
    }
    const cortexToggle=this.$content.querySelector('#toggle-cortex');
    if(cortexToggle)cortexToggle.checked=this.behaviorAllowed;
    const cortexMode=this.$content.querySelector('#cortex-mode');
    if(cortexMode)cortexMode.value=this.behaviorMode;
    const cortexStats=this.$content.querySelector('#cortex-summary');
    if(cortexStats){
      const stats=cortexSummary(this.cortex.state);
      cortexStats.textContent=stats.neurons+' neurônios • '+stats.synapses.toLocaleString('pt-BR')+
        ' conexões • '+stats.sensors+' sensores • '+stats.motors+' ações. '+stats.feedback+' aprendizados.';
    }
    const last=this.$content.querySelector('#cortex-last');
    if(last)last.textContent=this.lastAutoDecision?
      'Última iniciativa: '+this.lastAutoDecision.action+'. '+(this.lastAutoDecision.used?'Feedback registrado.':'Diga se foi útil.') :
      'O cérebro ainda não tomou nenhuma iniciativa nesta sessão.';
    const orbButton=this.$content.querySelector('[data-action="orb-toy"]');
    if(orbButton){
      orbButton.textContent=this.orbField?'Guardar orbe':'◉ Orbe arcano';
      if(!this.config.behavior.toy)orbButton.remove();
    }
    for(const button of this.$content.querySelectorAll('[data-action="cortex-like"],[data-action="cortex-dislike"]'))
      button.disabled=!this.lastAutoDecision||this.lastAutoDecision.used;
    const proactivity=this.$content.querySelector('#toggle-proactive');
    if(proactivity)proactivity.checked=this.observeProjects;
    const skinLabel=this.$content.querySelector('#arcane-skin-label');
    if(skinLabel){
      skinLabel.textContent='';
      const select=document.createElement('select');
      select.id='alquimago-skin-choice';
      select.setAttribute('aria-label','Skin do familiar');
      for(const entry of this.skinProfiles){
        const option=document.createElement('option');
        option.value=entry.id;
        option.textContent=entry.label;
        select.appendChild(option);
      }
      select.value=this.selectedSkin;
      skinLabel.appendChild(select);
    }
    const chatInput=this.$content.querySelector('input[name="message"]');
    if(chatInput)chatInput.placeholder=this.language.ui.message;
    const sendButton=this.$content.querySelector('.chat-send');
    if(sendButton)sendButton.setAttribute('aria-label',this.language.ui.send);
    const teachButton=this.$content.querySelector('[data-action="teach-neural"]');
    if(teachButton)teachButton.textContent=this.language.ui.learn;
    const teachLabel=this.$content.querySelector('.neural-teach label');
    if(teachLabel)teachLabel.textContent=this.language.ui.learnTitle;
    const closeButton=this.shadowRoot.getElementById('close-panel');
    if(closeButton)closeButton.setAttribute('aria-label',this.language.ui.close);
    if(this.config.memory.mode==='publish'){
      const reset=this.$content.querySelector('[data-action="reset-memory"]');
      if(reset)reset.textContent='Zerar rascunho do mago';
    }
    if(!flags.memoryTools)this.$content.querySelectorAll('[data-action="export-memory"],[data-action="import-memory"],[data-action="reset-memory"]').forEach(button=>button.remove());
  }
  createPrompt() {
    const a = this.desktop ? null : auditPage();
    return ['Sou o Alquimago, um familiar digital local. Preciso de assistência para o projeto do usuário.',
      'Contexto: ' + (a ? `${a.title} (${location.origin}${a.path})` : 'Aplicativo desktop Alquimago'),
      a ? `Diagnóstico básico: ${a.links} links, ${a.buttons} botões, ${a.images} imagens, ${a.missingAlt} imagens sem alt, ${a.duplicateIds} IDs repetidos.` : '',
      ...this.suggestions.slice(0,4).map(tip=>'Sugestão de melhoria: '+tip.title+' — '+tip.description),
      this.studioInfo?.editing?'Editor integrado: '+this.studioInfo.section+'; '+this.studioInfo.projects+' projetos; '+this.studioInfo.pages+' páginas.':'',
      this.config.assistant.projectContext?'Contexto: '+this.config.assistant.projectContext:'',
      ...this.config.assistant.guidelines.map(rule=>'Orientação: '+rule),
      ...this.projectFiles.filter(file=>file.status==='read').slice(0,4).map(file=>'Arquivo público '+file.file+': '+file.excerpt.slice(0,700)),
      'Objetivo: primeiro pergunte qual mudança o usuário deseja realizar. Preserve o visual atual até receber instruções.',
      'Não suponha acesso ao repositório nem a arquivos privados. Solicite permissão antes de publicar alterações.'].filter(Boolean).join('\n');
  }
  async copy(text) {
    try { await navigator.clipboard.writeText(text); this.message = 'Resumo copiado! Cole na conversa escolhida.'; }
    catch { this.message = 'Sem acesso à área de transferência. Use o botão em HTTPS ou copie manualmente.'; }
    this.renderHeader();
  }
  onContentClick(e) {
    const button = e.target.closest('button'); if (!button) return;
    if (button.dataset.navigate !== undefined) {
      const link = this.links[Number(button.dataset.navigate)];
      if(link && new URL(link.href).origin===location.origin){location.assign(link.href);this.message='Abrindo '+link.label+'…';this.renderHeader();}
      return;
    }
    if(button.dataset.say){this.sendMessage(button.dataset.say);return;}
    if(button.dataset.insight!==undefined){
      const tip=this.suggestions[Number(button.dataset.insight)];
      if(tip){
        window.open('https://chatgpt.com/','_blank','noopener,noreferrer');
        void this.copy(this.createPrompt()+'\n\nMelhoria solicitada: '+tip.title+' — '+tip.description);
      }
      return;
    }
    if(button.dataset.tipFeedback&&this.selectedProject){
      const i=Number(button.dataset.tipIndex);
      this.preferences=learnTip(this.preferences,this.selectedProject.category,i,button.dataset.tipFeedback==='yes');
      if(this.config.memory.mode!=='publish')writePreferences(storage(),this.config.memory.namespace,this.preferences);
      this.message=button.dataset.tipFeedback==='yes'?'Vou priorizar dicas desse tipo.':'Vou reduzir dicas desse tipo.';
      this.selectedProject.orderedTips=rankTips(this.selectedProject.tips,this.selectedProject.category,this.preferences);
      this.render();return;
    }
    if(button.dataset.action==='cortex-like'||button.dataset.action==='cortex-dislike'){
      const choice=this.lastAutoDecision;
      if(!choice||choice.used)return;
      const positive=button.dataset.action==='cortex-like';
      rewardCortex(this.cortex,choice.action,choice.context,positive?1:-1,Date.now());
      choice.used=true;
      this.lastUserActivity=Date.now();
      this.save();
      this.message=positive?'Aprendi: mais iniciativas como essa.':'Aprendi: menos desse comportamento.';
      this.render();return;
    }
    if(button.dataset.action==='orb-toy'){
      this.lastUserActivity=Date.now();
      this.startOrb();this.render();return;
    }
    const action = button.dataset.action;
    if (!action) return;
    if (['pet','stroke','play','brew','focus','rest','explore'].includes(action)) return this.action(action);
    if(['go-routes','go-files','go-ai','go-actions'].includes(action)){
      const target={ 'go-routes':2,'go-files':3,'go-ai':4,'go-actions':0 }[action];
      this.state.tab=target;this.render();return;
    }
    if(action==='copy-project-advice'){
      const a=this.selectedProject;
      if(a)void this.copy(a.label+'\n'+a.comment+'\n'+a.tips.join('\n')+'\n'+a.disclaimer);
      return;
    }
    if(action==='open-publish'){
      this.state.open=false;this.render();
      window.dispatchEvent(new Event('alquimago:request-publish'));
      return;
    }
    if(action==='teach-neural'){
      if(!this.lastUserText)return;
      const selected=this.$content.querySelector('#alquimago-teach')?.value;
      if(!INTENTS.includes(selected))return;
      if(!teachNeural(this.neural,this.lastUserText,selected))return;
      const corrected=neuralPredict(this.neural,this.lastUserText);
      if(this.config.memory.mode!=='publish')writeNeural(storage(),this.config.memory.namespace,this.neural);
      this.lastNeuralIntent=selected;
      const labels={greeting:'saudação',identity:'identidade',status:'status',pet:'carinho',play:'brincadeira',brew:'poção',rest:'descanso',navigate:'navegação',insight:'sugestão',help:'ajuda',mood:'humor',thanks:'agradecimento'};
      const reply='Aprendi: agora reconheço essa frase como '+(labels[selected]||selected)+'. Confiança: '+Math.round(corrected.confidence*100)+'%. '+(this.config.memory.mode==='publish'?'Publique para manter esse aprendizado.':'O aprendizado foi salvo.');
      this.dialogue=[...this.dialogue,{role:'familiar',text:reply}].slice(-24);
      if(this.config.memory.mode!=='publish')writeDialogue(storage(),this.config.memory.namespace,this.dialogue);
      this.message=reply;
      this.render();
      return;
    }
    if(action==='reset-memory'){
      // Hard reloads must keep persistent progress. Reset is always deliberate.
      const allowed=typeof window.confirm==='function'&&window.confirm(
        'Reiniciar XP, atributos e conversa deste Alquimago? Apenas os dados deste navegador e desta instalação serão redefinidos. O portfólio e o GitHub não serão alterados.'
      );
      if(!allowed)return;
      this.state.brain=restoreBrain(null);
      this.neural=seedNeuralModel();
      this.lastProjectId=null;this.pendingQuestion=null;
      this.preferences=blankPreferences();
      this.cortex=createCortexRuntime(createCortex());this.lastAutoDecision=null;
      this.lastUserText='';this.lastNeuralIntent='';
      this.state.position=null;
      this.dialogue=[];
      this.lastSpoken=null;
      this.lastSpokenAt=0;
      this.hoverStroke=freshStroke();
      this.style.left='';
      this.style.top='';
      this.style.right='';
      this.style.bottom='';
      // Write a fresh memory rather than deleting the key; otherwise a
      // public project-memory snapshot would immediately restore old XP.
      this.save();
      if(this.config.memory.mode!=='publish'){
        writeDialogue(storage(),this.config.memory.namespace,[]);
        writeNeural(storage(),this.config.memory.namespace,this.neural);
        writePreferences(storage(),this.config.memory.namespace,this.preferences);
      }
      this.message=this.config.memory.mode==='publish'?'Rascunho zerado. Publique para manter; recarregar recupera a última versão publicada.':'Memória local reiniciada. O projeto não foi alterado.';
      this.state.tab=0;
      this.render();
      return;
    }
    if(action==='export-memory'){
      const blob=new Blob([JSON.stringify(this.snapshot()||cleanMemory(null),null,2)],{type:'application/json'});
      const url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download='alquimago-memory.json';a.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      this.message='Backup da memória exportado.';this.renderHeader();return;
    }
    if(action==='import-memory'){
      const picker=document.createElement('input');picker.type='file';picker.accept='.json,application/json';
      picker.onchange=async()=>{try{
        const file=picker.files?.[0];if(!file||file.size>180000)return;
        const raw=await file.text(),state=parseBackup(raw);
        const imported=JSON.parse(raw);
        this.state.brain=restoreBrain(state.brain);this.state.position=state.position;
        this.neural=restoreNeuralModel(imported.neural)||seedNeuralModel();
        this.cortex=createCortexRuntime(imported.behavior||createCortex());
        this.save();
        if(this.config.memory.mode!=='publish')writeNeural(storage(),this.config.memory.namespace,this.neural);
        this.message=this.config.memory.mode==='publish'?'Memória importada para o rascunho. Publique para manter.':'Memória e aprendizado restaurados neste dispositivo.';
        this.render();
      }catch{this.message='Arquivo de memória inválido.';this.renderHeader();}};
      picker.click();return;
    }
    if(action==='read-files'){
      this.message='Lendo recursos autorizados...';this.renderHeader();
      void inspectProjectFiles(this.config.project.files,{pageUrl:location.href}).then(files=>{
        this.projectFiles=files;this.message=files.filter(f=>f.status==='read').length+' arquivo(s) lido(s).';this.render();
      });return;
    }
    if(action==='choose-folder'){
      const picker=document.createElement('input');picker.type='file';picker.multiple=true;picker.setAttribute('webkitdirectory','');
      picker.onchange=async()=>{
        const selection=Array.from(picker.files||[]).filter(f=>/\.(json|md|txt|ts|tsx|js|mjs|html|css|csv)$/i.test(f.name)).slice(0,20);
        const records=[];
        for(const file of selection){
          const name=file.webkitRelativePath||file.name;
          if(file.size>64000){records.push({file:name,status:'oversized'});continue;}
          try{const body=await file.text();records.push({file:name,status:'read',bytes:file.size,excerpt:body.slice(0,2000)});}
          catch{records.push({file:name,status:'unavailable'});}
        }
        this.projectFiles=records;this.message=records.filter(f=>f.status==='read').length+' arquivo(s) lido(s).';this.render();
      };
      picker.click();return;
    }
    if (action === 'audit') { this.audit = auditPage(); this.action('study'); return; }
    if (action === 'copy-audit') return this.copy(this.createPrompt());
    if (action === 'chatgpt' || action === 'gemini') {
      const destination = action === 'chatgpt' ? 'https://chatgpt.com/' : 'https://gemini.google.com/';
      // Abertura explicitamente solicitada, sem automatizar páginas de terceiros.
      window.open(destination, '_blank', 'noopener,noreferrer');
      void this.copy(this.createPrompt());
    }
  }
}
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (!customElements.get(TAG)) customElements.define(TAG, AlquimagoFamiliar);
  window.Alquimago = {
    version: '0.9.0',
    mount(target = document.body, mode = 'web') {
      const el = document.createElement(TAG);
      if (mode === 'desktop') el.setAttribute('data-mode', 'desktop');
      target.appendChild(el);
      return el;
    },
    destroy(){document.querySelectorAll(TAG).forEach(el=>el.remove());},
    exportState(){const el=document.querySelector(TAG);return el?.snapshot?.()||null;}
  };
  const autoMount = () => {
    if (window.ALQUIMAGO_AUTO_MOUNT === false || document.querySelector(TAG)) return;
    const slot = document.getElementById('alquimago-desktop');
    if (slot) window.Alquimago.mount(slot, 'desktop');
    else window.Alquimago.mount(document.body, 'web');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoMount, { once: true });
  else autoMount();
}

})();
